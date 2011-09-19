import glob
import helper
import sys

COMPILED = 1
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
JS_DEPS_BIN_PATH = DEPS_OUTPUT = JS_DEPS_OUTPUT_DIR + '/bin-deps-list.txt'
JS_DEPS_DEBUG_PATH = DEPS_OUTPUT = JS_DEPS_OUTPUT_DIR + '/debug-deps.js'



# DIRS
JS_SOURCES_DIRS = [
  'fu',
  'demo',
  'closure-lib/closure',
  'closure-lib/third_party',
  'soy-lib',
  ]

# Files
TPL_FILES = glob.glob(RESOURCE_DIR + '/demos/*.tpl')

DEMO_JS_FILES = helper.filter(glob.glob(RESOURCE_DIR + '/demo/*.js'), '.tpl')

DEMO_CSS_FILES = glob.glob(RESOURCE_DIR + '/css/demo.css')

EXTERN_JS_FILES = glob.glob(RESOURCE_DIR + '/externs/*.js')


