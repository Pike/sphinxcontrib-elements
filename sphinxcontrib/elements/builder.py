import json
import logging
import os
import types
from typing import Any, Dict, Set, Tuple
from sphinx.builders.html import StandaloneHTMLBuilder
from sphinx.locale import __
from sphinx.util.osutil import SEP, copyfile, ensuredir, os_path, relative_uri


logger = logging.getLogger(__name__)


class ElementsBuilder(StandaloneHTMLBuilder):
    name = 'sphinxcontrib-elements'
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
        if outfilename is  None:
            outfilename = os.path.join(self.outdir,
                                       os_path(pagename) + self.out_suffix)

        ctx['toctree'] = lambda **kwargs: self._get_local_toctree(pagename, **kwargs)

        # newtmpl = self.app.emit_firstresult('html-page-context', pagename,
        #                                     templatename, ctx, event_arg)
        # if newtmpl:
        #     templatename = newtmpl
        if templatename not in ('page.html', ):
            print("\n\n", templatename, pagename, "\n\n")
            return
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
                key in ('title', 'body') or
                isinstance(value, types.FunctionType)
            )
        }
        ctx['global_ctx'] = global_context
        ctx['local_ctx'] = local_context

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

    def handle_finish(self):
        # skip the stuff `SerializingHTMLBuilder` does
        StandaloneHTMLBuilder.handle_finish(self)
