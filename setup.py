#!/usr/bin/env python

import setuptools

from sphinxcontrib import elements

setuptools.setup(
    version=elements.__version__,
    packages=setuptools.find_packages(exclude=['tests']),
    include_package_data=True,
    namespace_packages=['sphinxcontrib'],
)
