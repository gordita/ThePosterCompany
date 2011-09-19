import config
import os


def gen_base_cmd() :
  sources_str = ' '.join([
  '-p %s/%s' % (config.RESOURCE_ROOT, res) for res in
  config.JS_SOURCES_DIRS
  ])

  cmd = '%s %s ' % (
    config.GENJSDEPS_BUILDER_PATH,
    sources_str)
  return cmd


def gen_js_bin_deps() :
  pass


def gen_js_debug_deps() :
  output_path = config.JS_DEPS_OUTPUT_DIR + '/debug-deps.js'
  output_str = ('-o deps > %s ' % output_path)
  cmd = gen_base_cmd() + output_str
  print cmd
  os.system(cmd)


if __name__ == '__main__' :
  os.system('clear')
  print 'gen_js_deps'
  gen_js_debug_deps()