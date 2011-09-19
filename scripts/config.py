import sys

# Workaround to import web module.
APPLICATION_PATH = 'application/'
sys.path.append(APPLICATION_PATH)

from app.web import webconfig

# COMPILED = webconfig.COMPILED
COMPILED = False
RESOURCE_ROOT = 'application/resource'

BUILD_INFO_DIR = 'build_info'
GENJSDEPS_BUILDER_PATH = '~/Documents/google-libs/closure-lib/closure/bin/calcdeps.py'
JS_DEPS_OUTPUT_DIR = RESOURCE_ROOT + '/deps'
TPL_COMPILER_PATH = 'application/resource/soy-lib/SoyToJsSrcCompiler.jar'

JS_SOURCES_DIRS = [
  'fu',
  'demos',
  'closure-lib/closure',
  'closure-lib/third_party',
  'soy-lib',
  ]

TPL_SOURCE_FILE_PATH_PATTERNS = [
  RESOURCE_ROOT + '/demos/*.tpl'
  ]


