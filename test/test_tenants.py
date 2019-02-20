import json
import os, django

import requests

from services.tenants import tenants_active
import json
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory


def test_tenants_active():
    request_factory = RequestFactory()
    middleware = SessionMiddleware()
    request = request_factory.post('/api/activeTenant',
        json.dumps({'solution_id': 'aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7'}),
                                content_type='application/json')
    middleware.process_request(request)
    response = tenants_active(request)
    assert response is not None
    assert response.status_code == 200

