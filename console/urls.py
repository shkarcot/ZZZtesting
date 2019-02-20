"""console URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
#from django.contrib import admin

from services import home as dashboard_views

#admin.site.site_header = 'Console Admin'
#admin.site.index_title = 'Console Admin'
#admin.site.site_title = 'Console Admin'

urlpatterns = [
 #   url(r'^admin/', admin.site.urls),
    url(r'^api/', include('api.urls')),
    url(r'^logout/', dashboard_views.logout_view),
    url(r'^$', dashboard_views.home),
    url(r'^views/(?P<html_name>.+)/$', dashboard_views.generic_views),
    url(r'^user/status/$', dashboard_views.get_user_state),
    url(r'openid/', include('djangooidc.urls')),
]
