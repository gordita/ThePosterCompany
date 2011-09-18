import django
import md5
import urllib

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response

from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch

import webconfig
import time
from manifest import MANIFEST
from manifest import MANIFEST_VERSION

# template.register_template_library('app.filters.template')
# template.register_template_library('app.filters.debug')
# for redirect
# return HttpResponseRedirect("/signup")

def offline(request):
  return index(request)

def index(request) :
  """
  Home
  """
  secret_value = 'u9cxz9c0c890px'
  secret_name = 'sc'
  pad_values = '123xxx:'
  sig = request.COOKIES.get(secret_name, None)
  if sig != secret_value:
    post_sig = request.POST.get('s', None)
    if post_sig == pad_values :
      res = HttpResponse(
        '<script>location.href = "/?t=%s";</script>' % time.time(),
        mimetype='text/html')
      res.set_cookie(secret_name, secret_value, 60 * 60 * 24 * 30)
      return res
    return templateView('bouncer')

  return jsPageView('homepage', request)


def profile(request) :
  """
  Home
  """
  return jsPageView('profilepage')


def temp(request) :
  """
  Redirect
  """
  return templateView('blank')


def depsjs(request) :
  return HttpResponse('', mimetype='text/javascript')


def manifest(request) :
  content = """
  CACHE MANIFEST

  """
  res = HttpResponse(MANIFEST.strip(), mimetype='text/cache-manifest')
  return res


def favicon(request) :
  return HttpResponse('', mimetype='image/x-icon')


def support(request) :
  return templateView('support')


def jsPageView(pageName, request) :
  payload = {}

  isIpad = request.META.get('HTTP_USER_AGENT').lower().find('ipad') > 0
  payload['IS_IPAD'] = isIpad
  payload['MANIFEST_VERSION'] = MANIFEST_VERSION
  payload['COMPILED'] = webconfig.COMPILED
  payload['PAGE_NAME'] = pageName
  payload['HAS_JS'] = 1
  payload['USE_EMBED_IMAGE'] = webconfig.USE_EMBED_IMAGE
  payload['CSS_FILE_NAMES'] = webconfig.CSS_FILE_NAMES

  return render_to_response('homepage.html', payload)


def templateView(pageName, payload={}) :
  return render_to_response('%s.html' % pageName, payload)


def textView(text) :
  return HttpResponse(text, mimetype='text/plain')