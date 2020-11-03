"""
    sphinxcontrib.elements
    ~~~~~~~~~~~~~~~~~~~~~~

    Custom HTML Elements for Sphinx

    :copyright: Copyright 2017 by Axel Hecht <axel@pike.org>
    :license: BSD, see LICENSE for details.
"""

import os

if False:
    # For type annotations
    from typing import Any, Dict  # noqa
    from sphinx.application import Sphinx  # noqa

__version__ = "0.1"


def setup(app):
    # type: (Sphinx) -> Dict[str, Any]
    from .builder import ElementsMixin
    from sphinx.builders.dirhtml import StandaloneHTMLBuilder, DirectoryHTMLBuilder

    class ElementsBuilder(ElementsMixin, StandaloneHTMLBuilder):
        name = 'sphinxcontrib-elements'

    class ElementsDirBuilder(ElementsMixin, DirectoryHTMLBuilder):
        name = 'sphinxcontrib-dir-elements'

    app.setup_extension('sphinx.builders.html')
    app.add_builder(ElementsBuilder)
    app.add_builder(ElementsDirBuilder)
    app.add_html_theme(
        'sphinxcontrib-elements-theme',
        os.path.join(os.path.abspath(os.path.dirname(__file__)), 'theme')
    )
    return {
        'version': __version__,
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }
