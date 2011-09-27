import config
import helper
import os
import time


EXTERN_FLAGS = [
('--externs=%s' % extern_file)
for extern_file in config.EXTERN_JS_FILES
]

DEFAULT_FLAGS = EXTERN_FLAGS + [
  '--define=goog.userAgent.ASSUME_WEBKIT',
  #  '--define=hw.config.BUILD_TIME=%s' % round(time.time()),
  #  '--define=hw.config.USE_NATIVE_LOGGER=false',
  #  '--define=hw.config.USE_HTML_LOGGER=false',
  #  '--define=hw.config.USE_MOCK_DATA=false',
  #  '--define=hw.config.USE_MOCK_FB_API=false',
  '--define=COMPILED',
  ]

PROD_DEFAULT_FLAGS = DEFAULT_FLAGS + [
  '--compilation_level=ADVANCED_OPTIMIZATIONS',
  '--warning_level=VERBOSE',
  # '--output_wrapper='(function() {%output%})();'',
  '--jscomp_error=checkTypes',
  '--jscomp_error=unknownDefines',
  '--jscomp_error=missingProperties',
  '--jscomp_error=strictModuleDepCheck',
  '--jscomp_error=accessControls',
  '--jscomp_error=visibility',
  '--module_output_path_prefix %s/' % config.JS_BIN_DIR
]

DESKTOP_FLAGS = PROD_DEFAULT_FLAGS + [
  '--define=goog.userAgent.product.ASSUME_CHROME',
  ]

IOS_FLAGS = PROD_DEFAULT_FLAGS + [
  '--define=goog.userAgent.product.ASSUME_IPHONE',
  '--define=goog.userAgent.product.ASSUME_IPAD',
  '--define=goog.userAgent.ASSUME_MOBILE_WEBKIT',
  ]

ANDROID_FLAGS = PROD_DEFAULT_FLAGS + [
]

DEBUG_FLAGS = DEFAULT_FLAGS + [
  '--formatting=pretty_print',
  '--compilation_level=WHITESPACE_ONLY'
]

def build_js(target_name, flags) :
  input_path = '%s/%s.txt' % (config.JS_DEPS_OUTPUT_DIR, target_name)
  flags_text = ''.join(['%s \\\n' % str(flag) for flag in flags])
  cmd = 'java -jar %s %s %s ' % (
    config.JS_COMPILER_PATH,
    flags_text,
    ' \\\n'.join(helper.get_file_lines(input_path))
    )
  print cmd
  os.system(cmd)

if __name__ == '__main__' :
  print '-' * 80
  print 'build_js'
  if helper.should_compile(config.DEFAULT_COMPILED):
    for target in config.JS_BIN_TARGETS :
      target_name = target[0]
      target_modules = target[1]
      build_js(target_name, PROD_DEFAULT_FLAGS)
    os.system('ls -al %s' % config.JS_BIN_DIR)
  else :
    print 'COMPILED is not True. Skip build JS'