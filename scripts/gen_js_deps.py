import config
import helper
import os


def gen_base_cmd() :
  sources_str = ' '.join([
  '-p %s/%s' % (config.RESOURCE_DIR, res) for res in
  config.JS_SOURCES_DIRS
  ])

  demo_modules_input_str = '\n'.join([
  '-i %s ' % demo_file for demo_file in config.DEMO_JS_FILES
  ])
  demo_files = config.DEMO_JS_FILES
  for demo_file in demo_files :
    print demo_file

  cmd = '%s %s %s' % (
    config.GENJSDEPS_BUILDER_PATH,
    sources_str,
    demo_modules_input_str)
  return cmd


def gen_js_bin_deps() :
  output_path = config.JS_DEPS_BIN_PATH
  output_str = ('-o list > %s ' % output_path)
  cmd = gen_base_cmd() + output_str
  print cmd
  os.system(cmd)

  modules = config.DEMO_JS_FILES

  lines = helper.get_file_lines(output_path)
  new_lines = []
  idx = 0
  last_module_name = None
  for line in lines :
    line = line.strip()
    new_lines.append('--js %s' % line)
    idx = idx + 1
    if line in modules :
      module_name = helper.get_module_name(line)
      if last_module_name is None :
        new_lines.append('--module %s:%s' % (module_name, idx))
      else :
        new_lines.append(
          '--module %s:%s:%s' % (module_name, idx, last_module_name))
      last_module_name = module_name
      idx = 0

  helper.write_text(output_path, '\n'.join(new_lines))


def gen_js_debug_deps() :
  output_path = config.JS_DEPS_DEBUG_PATH
  output_str = ('-o deps > %s ' % output_path)
  cmd = gen_base_cmd() + output_str
  print cmd
  os.system(cmd)

if __name__ == '__main__' :
  os.system('clear')
  print 'gen_js_deps'
  if config.COMPILED :
    gen_js_bin_deps()
  else :
    gen_js_debug_deps()