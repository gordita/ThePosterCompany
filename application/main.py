import os
import sys
import app

os.environ['DJANGO_SETTINGS_MODULE'] = 'app.settings'

from google.appengine.dist import use_library

use_library('django', '1.1')

#sys.path.append('c:/tmp/mashname')

# Google App Engine imports.
from google.appengine.ext.webapp import util

# A workaround to fix the partial initialization of Django before we are ready
from django.conf import settings
settings._target = None


import django.core.handlers.wsgi
import django.core.signals
import django.db
import django.dispatch.dispatcher

# Log errors.
#django.dispatch.dispatcher.connect(
#   log_exception, django.core.signals.got_request_exception)

# Unregister the rollback event handler.
# django.dispatch.dispatcher.disconnect(
#     django.db._rollback_on_exception,
#     django.core.signals.got_request_exception)

def main():
  # Create a Django application for WSGI.
  application = django.core.handlers.wsgi.WSGIHandler()

  # Run the WSGI CGI handler with that application.
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()

