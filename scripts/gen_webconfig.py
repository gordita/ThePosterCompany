import config
import helper

def gen_webconfig() :
  demo_css_files = []
  css_files = []

  for css_file in config.CSS_FILES :
    css_file = '/%s/%s' % (
      'resource/css',
      helper.get_file_name(css_file),
      )
    css_files.append("'%s'" % css_file)

  for css_file in config.DEMO_CSS_FILES :
    css_file = '/%s/%s' % (
      'resource/css',
      helper.get_file_name(css_file),
      )
    demo_css_files.append("'%s'" % css_file)

  text = '\n'.join([
    '# Generated file. DO NOT EDIT',
    'COMPILED = %s' % helper.should_compile(config.DEFAULT_COMPILED),
    'CSS_FILES = [\n%s\n]' % ',\n'.join(css_files),
    'DEMO_CSS_FILES = [\n%s\n]' % ',\n'.join(demo_css_files)
  ])
  print text
  helper.write_text(config.WEB_CONFIG_FILE_PATH, text)


if __name__ == '__main__' :
  print helper.should_compile(config.DEFAULT_COMPILED)
  print 'gen_webconfig'
  gen_webconfig()