import json

import pytest

from connections.mongodb import MongoDbConn
from services.template import ingest_template, TEMPLATE_COLLECTION, get_template, update_template, \
    save_template_element, delete_template_element, save_unknown_template

test_solution = "unit_test_solution"
test_template_obj = {
    "template_name": "default_template",
    "processing_state": "updated_template",
    "is_draft": False,
    "pages": {
        "1": {
            "insight_id": "ba5ca635-f358-4fd7-80d2-fab06eee5f6e",
            "metadata": {
                "deskew": {
                    "insight_id": "da9bcfb4-37f9-430c-a1d8-dffdc1166d78",
                    "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/documents/d031bd02-5e77-4cb3-bd53-3795c349dda5/pages/deskew-270_Whole_50_Data_16_med-07.png",
                    "bucket": "/efs",
                    "storage": "efs"
                },
                "keywords": {
                    "insight_id": "7a28aba5-80e0-46a5-b335-a2c0c6d4aa13",
                    "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/documents/4d2966bb-1921-4e17-80a7-d8097bdf7371/pages/270_Whole_50_Data_16_med-07_keywords.json",
                    "bucket": "/efs",
                    "storage": "efs"
                },
                "raw": {
                    "insight_id": "8b77bf09-4dcb-4c63-819e-253294fb69ad",
                    "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/documents/06fa3ce4-a80a-4f54-8b34-bd39985ecd3e/pages/270_Whole_50_Data_16_med-07.png",
                    "bucket": "/efs",
                    "storage": "efs"
                },
                "insight_id": "e8b96925-43fd-4c5a-8b83-b2b9252ceda4",
                "hocr": {
                    "insight_id": "9b4debd6-aaab-4cc1-b905-2bdc2d73d460",
                    "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/image-processing-data/extract_hocr/eed71ddb-9f23-4dfd-8593-9631516c7d43/hocr/col_25_270_Whole_50_Data_16_med-07.hocr",
                    "bucket": "/efs",
                    "storage": "efs"
                },
                "preprocess": {
                    "insight_id": "4f697ded-16da-4601-a7b6-84250f60efe5",
                    "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/documents/06fa3ce4-a80a-4f54-8b34-bd39985ecd3e/pages/col_25_270_Whole_50_Data_16_med-07.png",
                    "bucket": "/efs",
                    "storage": "efs"
                }
            },
            "num": 1
        }
    },
    "doc_state": "ready",
    "metadata": {
        "properties": {
            "file_resource": {
                "insight_id": "13f63bfd-1ef9-4710-acb1-63bb08c428c2",
                "key": None,
                "bucket": "/efs",
                "storage": "efs"
            },
            "num_pages": 0,
            "pdf_resource": {
                "insight_id": "6acceb65-111f-4b07-879f-3986f8d8c4a6",
                "key": None,
                "bucket": "/efs",
                "storage": "efs"
            },
            "insight_id": "ac0fa04e-eca1-424a-8a01-d0cc8d50e93e",
            "size": 0,
            "filename": "",
            "extension": ".png",
            "is_digital_pdf": False,
            "digital_pdf_resource": {
                "insight_id": "0c72b914-ce24-4bb6-b47c-dde9202efd59",
                "key": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68/documents/b11446ec-404a-43f6-b3a5-7d594096ec13/digital-deskew-270_Whole_50_Data_16_med-16.pdf",
                "bucket": "/efs",
                "storage": "efs"
            }
        },
        "template_info": {
            "score": 0.9991838935279213,
            "insight_id": "07f90617-fd30-4d3b-95ac-42e7c625e66c",
            "name": "unknown",
            "id": "unknown"
        }
    },
    "children": [
    ],
    "transitions": [
        [
            "extract_document_elements_complete",
            "2018-10-24T10:11:57.550347"
        ]
    ],
    "doc_id": "b11446ec-404a-43f6-b3a5-7d594096ec13",
    "elements": [
        {
            "coordinates": [
                {
                    "y2": 2682,
                    "x1": 0,
                    "page_number": 15,
                    "x2": 2119,
                    "insight_id": "4ae8e5e1-6654-43d6-80dd-273b9e9f2c6f",
                    "y1": 744
                }
            ],
            "section_id": "265a0c75-631f-44df-895f-dbb4ecad5536",
            "id": "265a0c75-631f-44df-895f-dbb4ecad5536",
            "value_coordinates_list": [
                {
                    "y2": 2682,
                    "x1": 0,
                    "x2": 2119,
                    "insight_id": "86ffb1a9-1015-4fd6-9253-9035b7fd4cdf",
                    "y1": 744,
                    "page_no": 15
                }
            ],
            "insight_id": "5573b94b-7b97-4695-afb2-38a2f8ac6e1b",
            "confidence": 80,
            "is_deleted": False,
            "page_no": 15,
            "type": "section",
            "value_coordinates": {
                "x2": 2119,
                "x1": 0,
                "y2": 2682,
                "y1": 744,
                "insight_id": "d1fd41fa-be40-47b1-883d-284ec36db326"
            },
            "parameters": {
                "insight_id": "8313ba28-79d7-4cf3-813f-e6d65d59c13c"
            },
            "elements": [
                {
                    "score": 80.0,
                    "avg_word_width": 1.741496598639456,
                    "is_deleted": False,
                    "right": False,
                    "value_coordinates": {
                        "x2": 334,
                        "x1": 155,
                        "y2": 765,
                        "y1": 744,
                        "insight_id": "102e8265-19e0-47eb-b260-4123842b8ed6"
                    },
                    "thickness": 1.3333333333333333,
                    "avg_word_height": 1.0,
                    "text": "SCHEDULED: ",
                    "left": False,
                    "coordinates": [
                        {
                            "y2": 765,
                            "x1": 155,
                            "page_number": 15,
                            "x2": 334,
                            "insight_id": "6b23b8fc-2287-4604-a967-e3f0743aa62b",
                            "y1": 744
                        }
                    ],
                    "center": False,
                    "section_id": "265a0c75-631f-44df-895f-dbb4ecad5536",
                    "id": "7afd464c-755d-4fb7-be4c-c2ecb00848ba",
                    "cap": True,
                    "value_coordinates_list": [
                        {
                            "y2": 765,
                            "x1": 155,
                            "x2": 334,
                            "insight_id": "892f6b50-2b06-4307-bcc5-44c30d9b3cc3",
                            "y1": 744,
                            "page_no": 15
                        }
                    ],
                    "insight_id": "9606c0f7-428c-4260-bcb5-fbf774f25856",
                    "confidence": 80.0,
                    "page_no": 15,
                    "type": "heading",
                    "phrase_no": 12,
                    "parameters": {
                        "insight_id": "4b3e3477-8214-4bd6-b476-5c09f2b92259",
                        "text": "SCHEDULED: "
                    },
                    "black_percent": 1.0833734822377123,
                    "temp_id": "default_265a0c75-631f-44df-895f-dbb4ecad5536"
                }
            ]
        },
        {
            "coordinates": [
                {
                    "y2": 2998,
                    "x1": 0,
                    "page_number": 15,
                    "x2": 2119,
                    "insight_id": "a30befc1-7793-47e3-9193-7e20747903ca",
                    "y1": 2682
                }
            ],
            "section_id": "db844d20-5c3c-4406-9a58-a67b29a234b4",
            "id": "db844d20-5c3c-4406-9a58-a67b29a234b4",
            "value_coordinates_list": [
                {
                    "y2": 2998,
                    "x1": 0,
                    "x2": 2119,
                    "insight_id": "1270c96b-e94c-4ec7-84c1-33e93e6a92fd",
                    "y1": 2682,
                    "page_no": 15
                }
            ],
            "insight_id": "29e064d9-89b6-4899-a21a-80c5bbe11c62",
            "confidence": 80,
            "is_deleted": False,
            "page_no": 15,
            "type": "section",
            "value_coordinates": {
                "x2": 2119,
                "x1": 0,
                "y2": 2998,
                "y1": 2682,
                "insight_id": "23aa4e1e-8b6d-4b18-ad68-1423d5e82759"
            },
            "parameters": {
                "insight_id": "607adb4f-4634-4730-b4b3-77eca40c52bd"
            },
            "elements": [
                {
                    "score": 80.0,
                    "avg_word_width": 2.2040816326530615,
                    "is_deleted": False,
                    "right": False,
                    "value_coordinates": {
                        "x2": 1901,
                        "x1": 1674,
                        "y2": 2716,
                        "y1": 2682,
                        "insight_id": "2e6c2508-77e7-43e5-8b45-b9c61aac4e33"
                    },
                    "thickness": 1.0,
                    "avg_word_height": 1.2307692307692308,
                    "text": "Page 42 of 411 ",
                    "left": False,
                    "coordinates": [
                        {
                            "y2": 2716,
                            "x1": 1674,
                            "page_number": 15,
                            "x2": 1901,
                            "insight_id": "55a2b7b2-2429-4ad3-bc9e-8aa3206a7f13",
                            "y1": 2682
                        }
                    ],
                    "center": False,
                    "section_id": "db844d20-5c3c-4406-9a58-a67b29a234b4",
                    "id": "4f970793-1a4b-4771-b490-0baf5e3ad887",
                    "cap": False,
                    "value_coordinates_list": [
                        {
                            "y2": 2716,
                            "x1": 1674,
                            "x2": 1901,
                            "insight_id": "6faeb225-d96b-4c0b-897f-35b4aa2bd48f",
                            "y1": 2682,
                            "page_no": 15
                        }
                    ],
                    "insight_id": "15b7222b-bf7d-4811-ba00-42615b55a916",
                    "confidence": 80.0,
                    "page_no": 15,
                    "type": "heading",
                    "phrase_no": 129,
                    "parameters": {
                        "insight_id": "93be45f2-374d-4b4d-8914-3d1d9050097e",
                        "text": "Page 42 of 411 "
                    },
                    "black_percent": 0.8017327670197232,
                    "element_id": "4f970793-1a4b-4771-b490-0baf5e3ad887"
                },
                {
                    "score": 80,
                    "coordinates": [
                        {
                            "y2": 2709,
                            "x1": 410,
                            "page_number": 15,
                            "x2": 480,
                            "insight_id": "8c9299eb-df88-4385-ae2d-7c08bb5ddddd",
                            "y1": 2682
                        }
                    ],
                    "section_id": "db844d20-5c3c-4406-9a58-a67b29a234b4",
                    "id": "c6c485b7-ac21-43d5-ab39-716d66fa2279",
                    "is_deleted": False,
                    "insight_id": "45736415-71fa-497b-9c98-76c240746581",
                    "confidence": 80,
                    "page_no": 15,
                    "text_list": [
                    ],
                    "type": "sentences",
                    "value_coordinates_list": [
                        {
                            "y2": 2709,
                            "x1": 410,
                            "x2": 480,
                            "insight_id": "9e48cad8-3513-4de0-a448-13a9e9d73604",
                            "y1": 2682,
                            "page_no": 15
                        }
                    ],
                    "value_coordinates": {
                        "x2": 480,
                        "x1": 410,
                        "y2": 2709,
                        "y1": 2682,
                        "insight_id": "c49de62a-4677-44cd-973c-8414f253a495"
                    },
                    "parameters": {
                        "text_list": [
                        ],
                        "insight_id": "6828b265-70c9-4eab-8af4-a7b840955cf4",
                        "text": ""
                    },
                    "text": "",
                    "element_id": "c6c485b7-ac21-43d5-ab39-716d66fa2279"
                }
            ]
        }
    ],
    "solution_id": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68",
    "page_groups": [],
    "is_template": True,
    "template_type": "known",
    "document_variables": {
        "265a0c75-631f-44df-895f-dbb4ecad5536": [
            {
                "name": "dob",
                "data_type": "string",
                "enable_rules": False,
                "rules": []
            },
            {
                "name": "patient_address",
                "data_type": "string",
                "enable_rules": False,
                "rules": ["0a6de4f3-545b-4db0-9fe2-1a4ce3e305db"]
            }
        ]
    },
    "domain_object_mapping": {
        "265a0c75-631f-44df-895f-dbb4ecad5536": [
            {
                "domain_object": "patient",
                "attribute": "dob"
            },
            {
                "domain_object": "patient",
                "attribute": "address"
            }
        ]
    },
}

m1_payload = dict(template_name="test_1", file_path="cms_2.pdf")
m1_expected = True

m2_payload = dict(template_name="test_2", file_path="CSF_3.pdf")
m2_expected = True

m3_payload = dict(template_name="test_3", file_path=None)
m3_expected = True


@pytest.mark.parametrize("test_msg",
                         [m1_payload, m2_payload, m3_payload]
                         )
def test_ingest_template(test_msg):
    response = ingest_template(solution_id=test_solution, payload=test_msg, file_path=test_msg["file_path"])
    assert response["success"]


def test_get_template():
    query = dict(solution_id=test_solution, is_deleted=False, template_id=test_template_obj["doc_id"])
    MongoDbConn.update(TEMPLATE_COLLECTION, query, {"template": json.dumps(test_template_obj)})
    response = get_template(test_solution)
    assert len(response["data"]) == 1


def test_publish_template():
    response = update_template(test_solution, dict(template_id=test_template_obj["doc_id"], is_draft=False))
    assert response["success"]


def test_save_template_element():
    m1 = {
        "score": 80.0,
        "avg_word_width": 1.741496598639456,
        "is_deleted": False,
        "right": False,
        "value_coordinates": {
            "x2": 334,
            "x1": 155,
            "y2": 765,
            "y1": 744,
            "insight_id": "102e8265-19e0-47eb-b260-4123842b8ed6"
        },
        "thickness": 1.3333333333333333,
        "avg_word_height": 1.0,
        "text": "SCHEDULED: ",
        "left": False,
        "coordinates": [
            {
                "y2": 765,
                "x1": 155,
                "page_number": 15,
                "x2": 334,
                "insight_id": "6b23b8fc-2287-4604-a967-e3f0743aa62b",
                "y1": 744
            }
        ],
        "center": False,
        "id": "892f6b50-2b06-4307-bcc5-44c30d9b3cc3",
        "section_id": "7afd464c-755d-4fb7-be4c-c2ecb00848ba",
        "cap": True,
        "value_coordinates_list": [
            {
                "y2": 765,
                "x1": 155,
                "x2": 334,
                "insight_id": "892f6b50-2b06-4307-bcc5-44c30d9b3cc3",
                "y1": 744,
                "page_no": 15
            }
        ],
        "insight_id": "9606c0f7-428c-4260-bcb5-fbf774f25856",
        "confidence": 80.0,
        "page_no": 15,
        "type": "heading",
        "phrase_no": 12,
        "parameters": {
            "insight_id": "4b3e3477-8214-4bd6-b476-5c09f2b92259",
            "text": "SCHEDULED: "
        },
        "black_percent": 1.0833734822377123,
        "template_id": "b11446ec-404a-43f6-b3a5-7d594096ec13",
        "domain_mapping": "claim.patient.dob"
    }
    response = save_template_element(solution_id=test_solution, data=m1)
    assert response["success"]


def test_delete_template_element():
    m1 = dict(template_id="b11446ec-404a-43f6-b3a5-7d594096ec13", id="c6c485b7-ac21-43d5-ab39-716d66fa2279")
    response = delete_template_element(test_solution, m1)
    assert response["success"]


def test_save_unknown_template():
    m1 = {"template_type": "unknown_known", "template_name": "unk1", "description": "test description for unk1",
          "elements": [{"name": "default", "type": "section", "section_id": "default", "elements": [
              {"name": "Section1", "type": "section", "elements": [], "possible_headings": ["dshhjde", "djd"],
               "domain_mapping": ["resume.experience.skills"]}]}]}
    response = save_unknown_template(test_solution, m1)
    assert response["success"]
