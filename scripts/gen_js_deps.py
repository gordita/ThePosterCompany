import config
import helper
import os


def gen_base_cmd(module_files) :
  sources_str = ' '.join([
  '-p %s/%s' % (config.RESOURCE_DIR, res) for res in
  config.JS_SOURCES_DIRS
  ])

  modules_input_str = '\n'.join([
  '-i %s ' % module_file for module_file in module_files
  ])

  cmd = '%s %s %s' % (
    config.GENJSDEPS_BUILDER_PATH,
    sources_str,
    modules_input_str)
  return cmd


def gen_js_bin_deps(target_name, module_files) :
  output_path = '%s/%s.txt' % (config.JS_DEPS_OUTPUT_DIR, target_name)
  output_str = ('-o list > %s ' % output_path)
  cmd = gen_base_cmd(module_files) + output_str
  print cmd
  os.system(cmd)
  lines = helper.get_file_lines(output_path)
  new_lines = []
  idx = 0
  last_module_name = None
  for line in lines :
    line = line.strip()
    new_lines.append('--js %s' % line)
    idx = idx + 1
    if line in module_files :
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
  cmd = gen_base_cmd([]) + output_str
  print cmd
  os.system(cmd)

if __name__ == '__main__' :
  os.system('clear')
  print 'gen_js_deps'
  if helper.should_compile(config.DEFAULT_COMPILED):
    for target in config.JS_BIN_TARGETS :
      target_name = target[0]
      target_modules = target[1]
      gen_js_bin_deps(target_name, target_modules)
  else :
    gen_js_debug_deps()