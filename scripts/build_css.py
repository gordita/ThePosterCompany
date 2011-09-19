import config
import helper
import os


def build_css(name, files) :
  texts = helper.get_files_text(files)
  raw_path = '%s/.raw.css' % config.BUILD_INFO_DIR
  helper.write_text(raw_path, texts)

  cmd = 'java -jar %s %s > %s/%s.css' % (
    config.CSS_COMPRESSOR_PATH,
    raw_path,
    config.CSS_BIN_DIR,
    name)

  print cmd
  os.system(cmd)


if __name__ == '__main__' :
  print 'build_css'
  build_css('demo', config.DEMO_CSS_FILES)