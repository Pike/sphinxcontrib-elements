"""
    sphinxcontrib.elements
    ~~~~~~~~~~~~~~~~~~~~~~

    Custom HTML Elements for Sphinx

    :copyright: Copyright 2017 by Axel Hecht <axel@pike.org>
    :license: BSD, see LICENSE for details.
"""

if False:
    # For type annotations
    from typing import Any, Dict  # noqa
    from sphinx.application import Sphinx  # noqa

__version__ = "0.1"


def setup(app):
    # type: (Sphinx) -> Dict[str, Any]
    return {'version': __version__, 'parallel_read_safe': True}
