import os, django
from unittest.mock import MagicMock

from django.test import RequestFactory

from config_vars import TEMPLATE_TRAIN_SAMPLES_COLLECTION
from connections.mongodb import MongoDbConn
from services.document_templates_train import template_train_upload_get
from utilities import common

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()



template_sample = {
    "doc_id" : "afe2d978a-0f6a-4844-b872-812222764908",
    "solution_id" : "aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7",
    "template_id" : "a629ac584-7afe-43c6-935c-507d76632dd3",
    "created_ts" : "2018-05-30T09:44:37.264686",
    "updated_ts" : "2018-05-30T09:44:37.264672",
    "metadata" : {
        "extn" : "jpg",
        "file_name" : "cms"
    },
    "file_path" : "qafix_f04b26a1-241b-4aad-a91d-0be28375df73/templates/1753c24d-d594-41d5-a788-363a724ba838/samples/e46649f6-473e-4708-8af7-06b295689969.jpg",
    "doc_state" : "processing",
    "doc_processing_state" : "ingest"
}


"""Insert TEMPLATE_TRAIN_SAMPLES_COLLECTION into db"""


def insert_template_sample_data(template_sample):
    MongoDbConn.insert(TEMPLATE_TRAIN_SAMPLES_COLLECTION, template_sample)
    return template_sample['solution_id']


insert_template_sample_data = insert_template_sample_data(template_sample)


"""Fetch TEMPLATE_TRAIN_SAMPLES_COLLECTION from db"""


def get_temp(solution_id=None):
    query = {"solution_id": solution_id}
    temp_data = MongoDbConn.find_one(TEMPLATE_TRAIN_SAMPLES_COLLECTION, query)
    return temp_data

get_temp(solution_id="aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7")


def test_template_train_upload_get(monkeypatch):
    request_factory = RequestFactory()
    page_data = template_sample
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    request = request_factory.get\
        ('/api/documentTemplates/train/upload/a629ac584-7afe-43c6-935c-507d76632dd3/$')
    response = template_train_upload_get(request, page_data['template_id'])
    assert response['status'] == 'success'


"""delete TEMPLATE_TRAIN_SAMPLES_COLLECTION database record"""


def test_delete_mapdb(solution_id="aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"):
    delete_map = MongoDbConn.remove(TEMPLATE_TRAIN_SAMPLES_COLLECTION, {"solution_id":solution_id})
    return True