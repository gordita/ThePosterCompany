import datetime
import md5
import random
import time

def get_client_id(request):
  """
  Get a somewhat unique ID from the client based on its IP, UserAgent and Host.
  Note this will return the same ID for the same browser on the same machine.
  """
  meta  = request.META

  raw_id = """
      secret-%s=%s=%s
      """ % (meta['HTTP_USER_AGENT'], meta['REMOTE_ADDR'], meta['HTTP_HOST'])
  return md5_encode(raw_id)


_XSRF_ENCODED_KEY = 'ad165f9b9619094e948da5df4eca3547'
_XSRF_EXPIRE_LIMIT = 1 * 60 * 60 # 1 hrs.

def get_encoded_xsrf_token():
  timestamp = str(time.time())
  token = md5_encode(_XSRF_ENCODED_KEY + timestamp)

  return dict(
    timestamp = timestamp,
    token = token
  )


_ESCAPED_HTML_ENTITIES = {
    '&': '&amp;',
    ''': '&quot;',
    ''': '&apos;',
    '>': '&gt;',
    '<': '&lt;',
    }

def html_escape(text = ''):
    """Produce entities within text."""
    return "".join(_ESCAPED_HTML_ENTITIES.get(c,c) for c in text)

def validate_xsrf_token(timestamp, token):
  now = time.time()
  past = float(timestamp)
  if (now - past) > _XSRF_EXPIRE_LIMIT:
    return False
  new_token = md5_encode(_XSRF_ENCODED_KEY + timestamp)
  return new_token == token

def md5_encode(value):
  """
  Get the Base64 encoded md5 string.
  """
  hash = md5.new()
  hash.update(value)
  return hash.hexdigest()