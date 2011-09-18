import sys

# Workaround to import web module.
APPLICATION_PATH = 'application/'
sys.path.append(APPLICATION_PATH)

from app.web import webconfig

RESOURCE_ROOT = 'application/resource'

JS_DEPS_OUTPUT_DIR = RESOURCE_ROOT + '/deps'

JS_SOURCES_DIRS = [
  'fu',
  'closure-lib/closure',
  'closure-lib/third_party',
  'soy-lib',
  ]

GENJSDEPS_BUILDER_PATH = '~/Documents/google-libs/closure-lib/closure/bin/calcdeps.py'