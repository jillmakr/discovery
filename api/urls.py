from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = patterns('',
    url(r'^vendors/$', views.ListVendors.as_view()),
    url(r'^naics/$', views.ListNaics.as_view()),
)

urlpatterns = format_suffix_patterns(urlpatterns)
