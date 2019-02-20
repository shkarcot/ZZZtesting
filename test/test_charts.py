import pytest

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'

import django
django.setup()
from config_vars import DASHBOARD_CONFIG
from connections.mongodb import MongoDbConn
from services.charts import chart_selectors

chart = {
    "chart_id" : "two222",
    "title" : "Document Status",
    "config" : [
        {
            "collection" : "form",
            "key_type" : "string",
            "key" : "status",
            "color" : "#3dae2b",
            "timestamp" : "timestamp",
            "name" : "Processed"
        },
        {
            "collection" : "form",
            "key_type" : "string",
            "key" : "status",
            "color" : "#09abff",
            "timestamp" : "timestamp",
            "name" : "Reviewed"
        },
        {
            "collection" : "form",
            "key_type" : "string",
            "key" : "status",
            "color" : "#ff6000",
            "timestamp" : "timestamp",
            "name" : "Error"
        }
    ]
}


@pytest.mark.run(order=1)
def insert_chart(chart):
    MongoDbConn.insert(DASHBOARD_CONFIG, chart)
    return chart['chart_id']


insert_chart = insert_chart(chart)

def get_chart(chart_id=None):
    query = {"chart_id": chart_id}
    temp_data = MongoDbConn.find_one(DASHBOARD_CONFIG, query)
    return temp_data

get_chart(chart_id="two222")


"""Test cases for chart_selectors"""

def test_chart_selectors():
    assert chart_selectors() is not None


@pytest.mark.run(order=10)
def delete_chart(chart_id=None):
    MongoDbConn.remove(DASHBOARD_CONFIG, {"chart_id":chart_id})
    return chart['chart_id']