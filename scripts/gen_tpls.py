import config
import glob
import helper
import os


GEN_FLAGS = [
  #'--cssHandlingScheme REFERENCE',
  '--shouldGenerateJsdoc',
  '--shouldProvideRequireSoyNamespaces',
  ]


def gen_tpl(path) :
  if (helper.is_modified(path) and
      not helper.should_compile(config.DEFAULT_COMPILED)) :
    print 'skip %s' % path
    return

  print 'gen_tpl %s\n' % path
  gen_flags = GEN_FLAGS[0 :]

  if helper.should_compile(config.DEFAULT_COMPILED) :
    gen_flags.append('--cssHandlingScheme REFERENCE')

  flags_str = ' '.join([str(soy_flag) for soy_flag in gen_flags])
  output_flag = '--outputPathFormat %s.js' % path
  cmd = 'java -jar %s %s %s %s' % (
    config.TPL_COMPILER_PATH,
    flags_str,
    output_flag,
    path)
  print cmd
  os.system(cmd)

  if helper.should_compile(config.DEFAULT_COMPILED) :
    helper.write_text(helper.get_build_info_file(path), 'build..')
  else :
    helper.write_text(helper.get_build_info_file(path),
                      str(os.path.getmtime(path)))


def gen_tpls() :
  for tpl_file in config.TPL_FILES :
    gen_tpl(tpl_file)

if __name__ == '__main__' :
  print '-' * 80
  print 'gen_tpls'
  gen_tpls()