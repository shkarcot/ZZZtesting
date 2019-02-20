import os
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
from services.service_catalog import get_services
solution_id = "test-m_46d328cf-6229-4a41-8c42-c55c933b6072"


def test_get_services():
    res = get_services(solution_id)
    assert type(res)==dict
    assert "status" and "msg" in res.keys()