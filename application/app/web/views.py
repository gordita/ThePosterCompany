import django
import md5
import urllib

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response

from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch

import config
import time


def offline(request) :
  return index(request)


def index(request) :
  return textView(':-)')


def favicon(request) :
  return HttpResponse('', mimetype='image/x-icon')


def demo(request, file_name) :
  if config.COMPILED :
    file_name = 'demo_%s' % file_name

  payload = {
    'file_name' : file_name,
    'compiled' : config.COMPILED
  }
  return templateView('demo', payload)


def templateView(pageName, payload={}) :
  return render_to_response('%s.html' % pageName, payload)


def textView(text) :
  return HttpResponse(text, mimetype='text/plain')