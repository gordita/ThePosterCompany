import config
import helper
import os

CMD = ('''
python scripts/gen_webconfig.py
python scripts/gen_css.py
python scripts/gen_tpls.py
python scripts/gen_js_deps.py
python scripts/build_js.py
''').strip()

if __name__ == '__main__' :
  if helper.should_compile(config.DEFAULT_COMPILED) :
    lines = ['%s -c;' % line.strip() for line in CMD.splitlines()]
  else :
    lines = ['%s ;' % line.strip() for line in CMD.splitlines()]
  cmd = '\n'.join(lines)
  os.system('clear')
  print cmd
  os.system(cmd)
