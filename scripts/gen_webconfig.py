import config
import helper

def gen_webconfig() :
  text = '\n'.join([
    '# Generated file. DO NOT EDIT',
    'COMPILED = %s' % config.COMPILED
  ])
  helper.write_text(config.WEB_CONFIG_FILE_PATH, text)

  
if __name__ == '__main__' :
  print 'gen_webconfig'
  gen_webconfig()