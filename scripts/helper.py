import config
import os

def write_text(path, text) :
  file = open(path, 'w')
  file.write(text)
  file.close()

def get_file_text(path) :
  file = open(path)
  lines = []
  for line in file.xreadlines() :
    lines.append(line.strip())
  file.close()
  return ''.join(lines)

def is_modified(path) :
  time_1 = os.path.getmtime(path)
  time_2 = get_file_text(get_build_info_file(path))
  if str(time_1) != str(time_2) :
    return False
  return True

def get_build_info_file(path) :
  path = path.replace('/', '_')
  path = path.replace('\\', '_')
  path = config.BUILD_INFO_DIR + '/.' + path
  if not os.path.exists(path) :
    write_text(path, 'new')
  return path