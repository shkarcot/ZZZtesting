import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'

import django
django.setup()

from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory
from django.contrib.auth.models import User
from services.home import logout_view, get_user_state, generic_views, home


def test_logout_view():
    request_factory = RequestFactory()
    middleware = SessionMiddleware()
    request = request_factory.get('/logout/')
    middleware.process_request(request)
    response = logout_view(request)
    assert response is not None
    assert response.status_code == 302


# def test_get_user_state():
#     request_factory = RequestFactory()
#     middleware = SessionMiddleware()
#     request = request_factory.get('/user/status/')
#     request.user = User.objects.create(username='dummy_user1',
#                                        password='test_pass')
#     middleware.process_request(request)
#     response = get_user_state(request)
#     request.user.delete()
#     assert response.status_code == 200


def test_generic_views():
    request_factory = RequestFactory()
    middleware = SessionMiddleware()
    request = request_factory.get('/views/''/')
    middleware.process_request(request)
    response = generic_views(request, html_name = '')
    assert response.status_code == 200


# def test_home():
#     request_factory = RequestFactory()
#     middleware = SessionMiddleware()
#     request = request_factory.get('/')
#     request.user = User.objects.create(username='dummy_user1',
#                                        password='test_pass')
#     middleware.process_request(request)
#     response = home(request)
#     request.user.delete()
#     assert response.status_code == 200

