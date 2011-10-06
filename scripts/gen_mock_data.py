import config
import helper
import os

def gen_mock_data() :
  requires = []
  for data_file in config.MOCK_DATA_FILES :
    lines = helper.get_file_lines(data_file, True)
    for line in lines :
      if line.find('goog.provide(') == 0 :
        line = 'goog.require' + line[line.rfind('(') :]
        requires.append(line)
        break
  requires.sort()
  input_lines = helper.get_file_lines(config.JS_FBAPI_FILE_PATH)
  output_lines = []
  provide_line = None
  for line in input_lines :
    stripped_line = line.strip()
    if stripped_line.find('goog.provide(') == 0 :
      provide_line = stripped_line
    elif stripped_line.find('goog.require(') == 0 :
      if not stripped_line in requires :
        requires.append(stripped_line)
    else :
      output_lines.append(line)

  requires.sort()
  output_text = '%s\n\n%s\n\n%s' % (
    provide_line,
    '\n'.join(requires),
    ''.join(output_lines)
    )
  helper.write_text(config.JS_FBAPI_FILE_PATH, output_text)

if __name__ == '__main__' :
  # Make fbapi includes all mock data.
  print 'gen_mock_data'
  gen_mock_data()
