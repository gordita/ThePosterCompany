from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^cache\.manifest$', 'app.web.views.manifest'),
    (r'^favicon\.ico$', 'app.web.views.favicon'),
    (r'^offline', 'app.web.views.offline'),
    (r'^deps\.js', 'app.web.views.depsjs'),
    (r'^support$', 'app.web.views.support'),
    (r'^profile\.php', 'app.web.views.profile'),
    (r'^.+deps\.js$', 'app.web.views.depsjs'),
    (r'^.+', 'app.web.views.index'),
    (r'^$', 'app.web.views.index'),
    #(r'^demo/(?P<page_name>[a-zA-Z0-9_]+)', 'app.site.views.demo'),
    #(r'^create/$', 'app.poll.views.create'),
    #(r'^poll/(?P<poll_key>[^\.^/]+)/$', 'app.poll.views.poll_detail'),
    #(r'^poll/(?P<poll_key>[^\.^/]+)/results/$', 'app.poll.views.poll_results'),
    #(?P<username>[^\.^/]+)
    )
