import config
import os

def write_text(path, text) :
  file = open(path, 'w')
  file.write(text)
  file.close()


def get_file_text(path) :
  return ''.join(get_file_lines(path))


def get_files_text(paths) :
  texts = []
  for path in paths :
    texts.append(get_file_text(path))
  return ''.join(texts)


def get_file_lines(path) :
  file = open(path)
  lines = []
  for line in file.xreadlines() :
    lines.append(line.strip())
  file.close()
  return lines


def is_modified(path) :
  time_1 = os.path.getmtime(path)
  time_2 = get_file_text(get_build_info_file(path))
  if str(time_1) != str(time_2) :
    return False
  return True


def get_module_name(path) :
  prefix = 'application_resource_'
  suffix = '_js'
  path = path.replace('/', '_')
  path = path.replace('\\', '_')
  path = path.replace('.', '_')
  if path.find(prefix) == 0 and path.find(suffix) > 0 :
    return path[len(prefix) : path.find(suffix)]
  else :
    raise


def filter(items, filter_value) :
  new_items = []
  for item in items :
    if filter_value in item :
      pass
    else :
      new_items.append(item)
  return new_items


def get_build_info_file(path) :
  path = path.replace('/', '_')
  path = path.replace('\\', '_')
  path = config.BUILD_INFO_DIR + '/.' + path
  if not os.path.exists(path) :
    write_text(path, 'new')
  return path