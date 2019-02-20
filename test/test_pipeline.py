import os
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
from services.pipeline import pipeline_params, get_nifi_link


solution_id = "test-m_46d328cf-6229-4a41-8c42-c55c933b6072"


def test_get_nifi_link():
    res = get_nifi_link(solution_id)
    assert type(res) == str
    res = get_nifi_link("test_dummy")
    assert res == ""


def test_pipeline_params():
    res = pipeline_params(solution_id)
    assert type(res) == dict
    assert "nifi_link" and "elk_link" in res.keys()
