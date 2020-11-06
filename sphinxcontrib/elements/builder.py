import json
import logging
import os
import types
from typing import Any, Dict, Tuple
from docutils import nodes
from sphinx.environment.adapters.toctree import TocTree
from sphinx.locale import __
from sphinx.util.docutils import new_document
from sphinx.util.osutil import copyfile, ensuredir, os_path, relative_uri
from sphinx.writers.html5 import HTML5Translator


logger = logging.getLogger(__name__)


class pagetoc(nodes.General, nodes.Element):
    pass


class TocTranslator(HTML5Translator):
    document_prefix = [
        '<!DOCTYPE html>\n',
        '<html>\n',
        '<head>\n',
        '<meta charset="UTF-8">\n',
        '</head>\n',
        '<body>\n'
    ]
    document_suffix = [
        '</body>\n',
        '</html>\n',
    ]

    def astext(self) -> str:
        return ''.join(
            self.document_prefix +
            self.body +
            self.document_suffix
        )

    def visit_pagetoc(self, node: nodes.Element) -> None:
        self.body.append(self.starttag(node, 'template', pagename=node["pagename"]))

    def depart_pagetoc(self, node: nodes.Element) -> None:
        self.body.append('</template>\n')

    def visit_toctree(self, node: nodes.Element) -> None:
        atts = {}
        atts['class'] = 'pagerefs'
        for attname in (
            'caption', 'glob', 'hidden', 'includehidden', 'maxdepth', 'numbered', 'titlesonly'
        ):
            if node[attname] is not None:
                atts[attname] = node[attname]
        self.body.append(self.starttag(node, 'div', **atts))
        for title, pagename in node["entries"]:
            atts = {}
            atts['data-pagename'] = pagename
            self.body += [
                self.starttag(node, 'span', suffix='', **atts),
                '</span>\n',
            ]

    def depart_toctree(self, node: nodes.Element) -> None:
        self.body.append('</div>\n')


class ElementsMixin:
    implementation = None
    implementation_dumps_unicode = True
    indexer_format = json
    indexer_dumps_unicode = True
    out_suffix = '.html'
    searchindex_filename = 'searchindex.json'

    def get_theme_config(self) -> Tuple[str, Dict]:
        _, options = super().get_theme_config()
        return ('sphinxcontrib-elements-theme', options)

    def init_css_files(self) -> None:
        pass

    def init_js_files(self) -> None:
        pass

    def gen_additional_pages(self) -> None:
        adapter = TocTree(self.env)
        settings = self.docsettings.copy()
        settings.xml_declaration = False
        doc = new_document("", self.docsettings)
        for pagename in self.env.tocs.keys():
            toc = adapter.get_toc_for(pagename, self)
            tocnode = pagetoc()
            tocnode["pagename"] = pagename
            tocnode += [toc.deepcopy()]
            doc.append(tocnode)
        tt = TocTranslator(doc, self)
        doc.walkabout(tt)
        outfilename = os.path.join(self.outdir, "_tocs.html")
        with open(outfilename, "w") as fh:
            fh.write(tt.astext())
        super().gen_additional_pages()

    def add_sidebars(self, pagename: str, ctx: Dict) -> None:
        pass

    def handle_page(
        self, pagename, ctx,
        templatename='page.html', outfilename=None, event_arg=None
    ):
        # type: (str, Dict, str, str, Any) -> None
        ctx['pagename'] = pagename
        default_baseuri = self.get_target_uri(pagename)
        ctx['depth'] = relative_uri(default_baseuri, 'a')[:-1] or "./"
        ctx['elements_theme'] = ctx['depth'] + '_static'
        if outfilename is None:
            outfilename = self.get_outfilename(pagename)

        ctx['toctree'] = lambda **kwargs: self._get_local_toctree(pagename, **kwargs)

        global_context = {
            key: value
            for key, value in self.globalcontext.items()
            if not (
                key.startswith('theme_') or
                key.startswith('show_') or
                key.endswith('_files') or
                key in ctx
            )
        }

        # make local context object serializable
        local_context = {
            key: value
            for key, value in ctx.items()
            if not (
                key.startswith('toc') or
                key in ('body',) or
                isinstance(value, types.FunctionType)
            )
        }
        def pathto(otheruri: str, resource: bool = False, baseuri: str = default_baseuri) -> str:  # NOQA
            if resource and '://' in otheruri:
                # allow non-local resources given by scheme
                return otheruri
            elif not resource:
                otheruri = self.get_target_uri(otheruri)
            uri = relative_uri(baseuri, otheruri) or '#'
            if uri == '#' and not self.allow_sharp_as_current_path:
                uri = baseuri
            return uri
        # fix up rellinks to be rich data
        if 'rellinks' in local_context:
            local_context['rellinks'] = [
                {
                    "href": pathto(rellink[0]),
                    "title": rellink[1],
                    "accessKey": rellink[2],
                    "textContent": rellink[3],
                }
                for rellink in local_context['rellinks']
            ]
        local_context['master_href'] = pathto(global_context['master_doc'])
        ctx['global_ctx'] = global_context
        ctx['local_ctx'] = local_context
        ctx['script_files'] = self.script_files
        ctx['pathto'] = pathto
        newtmpl = self.app.emit_firstresult('html-page-context', pagename,
                                            templatename, ctx, event_arg)
        if newtmpl:
            templatename = newtmpl
        if templatename not in ('page.html', ):
            print("\n\n", templatename, pagename, "\n\n")
            return

        ensuredir(os.path.dirname(outfilename))
        output = self.templates.render(templatename, ctx)
        try:
            with open(outfilename, 'w', encoding='utf-8',
                      errors='xmlcharrefreplace') as f:
                f.write(output)
        except OSError as err:
            logger.warning(__("error writing file %s: %s"), outfilename, err)

        # if there is a source file, copy the source file for the
        # "show source" link
        if ctx.get('sourcename'):
            source_name = os.path.join(self.outdir, '_sources',
                                       os_path(ctx['sourcename']))
            ensuredir(os.path.dirname(source_name))
            copyfile(self.env.doc2path(pagename), source_name)
