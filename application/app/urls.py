from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^demo/(?P<file_name>[a-zA-Z0-9_]+)', 'app.web.views.demo'),
    (r'^.+', 'app.web.views.index'),
    (r'^$', 'app.web.views.index')
    )
