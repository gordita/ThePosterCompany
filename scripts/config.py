import glob
import helper
import sys

DEFAULT_COMPILED = 0
USE_EMBED_IMAGE = 0

# Tools
CSS_COMPRESSOR_PATH = '~/Documents/yui-libs/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar'
GENJSDEPS_BUILDER_PATH = '~/Documents/google-libs/closure-lib/closure/bin/calcdeps.py'
JS_COMPILER_PATH = '~/Documents/google-libs/jsc/compiler.jar'
TPL_COMPILER_PATH = 'application/resource/soy-lib/SoyToJsSrcCompiler.jar'

# DIR
APPLICATION_DIR = 'application/'
BUILD_INFO_DIR = 'build_info'
RESOURCE_DIR = APPLICATION_DIR + 'resource'
JS_DEPS_OUTPUT_DIR = RESOURCE_DIR + '/deps'
JS_BIN_DIR = APPLICATION_DIR + 'bin/js'

CSS_BIN_DIR = APPLICATION_DIR + 'bin/css'


# PATH
WEB_CONFIG_FILE_PATH = APPLICATION_DIR + 'app/web/config.py'
JS_DEPS_DEBUG_PATH = DEPS_OUTPUT = JS_DEPS_OUTPUT_DIR + '/debug-deps.js'
JS_CSS_NAMES_PATH = RESOURCE_DIR + '/fu/cssnames.js'

# DIRS
JS_SOURCES_DIRS = [
  'fu',
  'demo',
  'closure-lib/closure',
  'closure-lib/third_party',
  'module',
  'soy-lib',
  ]

# Files
TPL_FILES = (
  glob.glob(RESOURCE_DIR + '/demo/*.tpl') +
  glob.glob(RESOURCE_DIR + '/fu/layout/*.tpl') +
  glob.glob(RESOURCE_DIR + '/fu/app/fastweb/*.tpl')
  )

CSS_FILES = [
  RESOURCE_DIR + '/css/reset.css',
  RESOURCE_DIR + '/css/base.css',
  RESOURCE_DIR + '/css/layout.css',
  RESOURCE_DIR + '/css/topbar.css',
  ]

DEMO_JS_FILES = helper.filter(glob.glob(RESOURCE_DIR + '/demo/*.js'), '.tpl')

DEMO_CSS_FILES = CSS_FILES + glob.glob(RESOURCE_DIR + '/css/demo.css')

EXTERN_JS_FILES = glob.glob(RESOURCE_DIR + '/externs/*.js')

# Module & DEMO targets.
JS_BIN_TARGETS = [
  ('demo-test', [RESOURCE_DIR + '/demo/test.js']),
  # ('demo-scroller', [RESOURCE_DIR + '/demo/scroller.js']),
  # ('dummy-module', [RESOURCE_DIR + '/module/dummymodule.js']),
]
