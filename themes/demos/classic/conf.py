import os
import sys

sys.path.append(os.path.join(sys.argv[-2], "demo"))
print("", sys.path[-1], "", sep="\n" + "-" * 80 + "\n")

html_theme = 'classic'
html_theme_options = {
}

# -- Project information -----------------------------------------------------

project = "Sphinx Themes Sample"
copyright = "2020, Pradyun Gedam"
author = "Pradyun Gedam"
language = "en"

# -- Extensions --------------------------------------------------------------
extensions = [
    "sphinx.ext.intersphinx",
    "sphinx.ext.autodoc",
    "sphinx.ext.mathjax",
    "sphinx.ext.viewcode",
]

# -- Options for HTML output -------------------------------------------------

html_title = project
