import config
import helper
import os
import sys

def run_app(use_local_host) :
  ifconfig_path = '%s/ifconfig.info' % config.BUILD_INFO_DIR
  os.system('ifconfig > %s' % ifconfig_path)
  lines = helper.get_file_lines(ifconfig_path, True)
  ip = '127.0.0.1'
  if not use_local_host :
    for line in lines :
      idx0 = line.find('127.0')
      idx1 = line.find('inet ')
      idx2 = line.find(' netmask ')
      if idx0 == -1 and idx1 == 0 and idx2 > 0 :
        ip = line[(idx1 + 5) :idx2]
        break

  print '-' * 80
  print '\n\nhttp://%s:9999/demo/scroller\n\n' % ip
  print '-' * 80
  cmd = 'dev_appserver.py --address=%s --debug --port=9999 application;' % ip
  print cmd
  os.system(cmd)


if __name__ == '__main__' :
  use_local_host = True
  for arg in sys.argv :
    if arg.find('-') is 0 :
      if arg == '-c' :
        use_local_host = False
        break
  run_app(use_local_host)