# TEST Parmeters
# TEST_USERNAME = "3c21804c-dcf2-4797-8967-11e7ead094cc"
# TEST_SOLN_NAME = "a037cf0d-4351-4ad7-9751-7d710f66cf3d"

TEST_USERNAME = "abc_se"
TEST_SOLN_NAME = "abc"

TEST_SOLN = {"solution_name": TEST_SOLN_NAME, "solution_type": " automation", "description": "asd"}
TEST_ENTITIES = {
    "entity_cfg": [{
        "entity_name": "person",
        "entity_synonym": [],
        "entity_type": "user",
        "primary_key": ["mrn"],
        "attributes": [{
            "key_name": "mrn",
            "synonym": ["id"],
            "type": "numeric"
        },
            {
                "key_name": "first_name",
                "synonym": ["f_name"],
                "type": "string"
            },
            {
                "key_name": "last_name",
                "synonym": ["l_name"],
                "type": "string"
            },
            {
                "key_name": "age",
                "synonym": [],
                "type": "numeric"
            },
            {
                "key_name": "discharge_summary",
                "synonym": [],
                "type": "string",
                "enrichments": ["Extract Entities"]
            }
        ]
    },
        {
            "entity_name": "medication",
            "entity_synonym": ["medicine"],
            "entity_type": "non_user",
            "primary_key": ["drug_info", "patient"],
            "attributes": [{
                "key_name": "medication_id",
                "synonym": ["id"],
                "type": "numeric"
            },
                {
                    "key_name": "course",
                    "synonym": [],
                    "type": "string"
                },
                {
                    "key_name": "description",
                    "synonym": [],
                    "type": "string",
                    "enrichments": ["Extract Entities, Extract Intent"]
                }
            ]
        }
    ]
}
TEST_FEEDBACK = {
    "insight_id": "val",
    "feedback": [{
        "type": "action",
        "text":"9"
    }]
}
TEST_ERROR_FEEDBACK = {
    "feedback": [{
        "type": "action",
        "vote": "1",
        "rate": 7
    }]
}

TEST_FEEDBACK_COLLECTION = "feedback_test"
from connections.mongodb import MongoDbConn
from config_vars import ENTITY_CONFIG, ENTITY_COLLECTION,MAPPING_COLLECTION,SECTIONS_COLLECTION

add_test_entity = {
    "entity_name": "Email_Use_case",
    "solution_id": "test-m_46d328cf-6229-4a41-8c42-c55c933b6072",
    "doc_id": "test@123",
    "ts": "2018-03-26T17:03:11",
    "ner_type": "",
    "entity_type": "domain_object",
    "entity_synonym": [],
    "primary_key": [],
    "attributes": [
        {
            "entity_relation": {},
            "synonym": [],
            "rule_id": [],
            "values": [],
            "type": "string",
            "corpus": "",
            "ner_type": "",
            "enrichments": [
                "extract_intent"
            ],
            "key_name": "email_content"
        },
        {
            "entity_relation": {
                "cardinality": "1",
                "name": "Provider"
            },
            "synonym": ["Providers"],
            "rule_id": [],
            "values": [],
            "type": "entity",
            "corpus": "",
            "ner_type": "PERSON",
            "enrichments": [],
            "key_name": "Provider"
        }
    ]
}


def post_test_entity(data=add_test_entity):
    MongoDbConn.insert(ENTITY_COLLECTION, data)
    return "done"


def del_test_entity(solution_id=None):
    query = {"solution_id": solution_id}
    data = MongoDbConn.remove(ENTITY_COLLECTION, query)
    return data


solution_id = "test-m_46d328cf-6229-4a41-8c42-c55c933b6072"
doc_id = add_test_entity["doc_id"]


# test document_templates.py
from config_vars import TEMPLATE_COLLECTION
from connections.mongodb import MongoDbConn

test_doc_temp_solution_id = "test_m_ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"
test_doc_temp_template_id = "test_25462914-2357-4833-957a-8a373a6d2eef"

doc_temp_var = {
    "solution_id": "test_m_ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7",
    "template_id": "test_25462914-2357-4833-957a-8a373a6d2eef",
    "is_deleted": False,
    "template_name": "azucar",
    "created_ts": "2018-05-28T12:05:01.555726",
    "updated_ts": "2018-05-28T12:09:59.433701",
    "is_draft": False,
    "template_type": "known",
    "file_name": "Azucar",
    "file_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/a5eda780-316e-4eef-a977-046ebea76360.pdf",
    "doc_processing_state": "processed_extract_text",
    "doc_state": "ready",
    "extn": "pdf",
    "pages": [
        {
            "text_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-3.txt",
            "file_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/pages/a5eda780-316e-4eef-a977-046ebea76360-3.png",
            "hocr_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-3.hocr",
            "page_no": 3,
            "keywords": [
                "clamping",
                "50",
                "should",
                "required",
                "documents",
                "The",
                "cleaned",
                "during",
                "any",
                "the",
                "of",
                "every",
                "to",
                "will",
                "which",
                "trucks",
                "low",
                "in",
                "each",
                "load",
                "shipment",
                "STORAGE",
                "transport",
                "not",
                "truck",
                "Tar",
                "3",
                "is",
                "Relative",
                "check",
                "transported",
                "closed",
                "completely",
                "pallets",
                "devices",
                "used",
                "road",
                "Transportation",
                "If",
                "movement",
                "temperature",
                "register",
                "prevent",
                "container",
                "Results",
                "Humidity",
                "door",
                "throughout",
                "shall",
                "AND",
                "plastic",
                "Page",
                "on",
                "Min",
                "odors",
                "covered",
                "contaminate",
                "b",
                "refrigeration",
                "and",
                "or",
                "sheets",
                "cold",
                "valve",
                "free",
                "andlor"
            ]
        },
        {
            "text_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-2.txt",
            "file_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/pages/a5eda780-316e-4eef-a977-046ebea76360-2.png",
            "hocr_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-2.hocr",
            "page_no": 2,
            "keywords": [
                "have",
                "received",
                "50",
                "Sub",
                "Outcom",
                "months",
                "Sample",
                "Yes",
                "Instrument",
                "uniform",
                "characteristic",
                "Test",

                "27",
                "MethodZ",
                "UOMZ",
                "Yeast",
                "per",
                "applicable",
                "Bags",
                "strum",
                "tion",
                "Outside",
                "each",
                "in",
                "Size",
                "not",
                "4",
                "net",
                "Or",
                "Name",
                "94cmx94cmx160cm",
                "This",
                "batch",
                "date",
                "Outcome",
                "SENSORY",
                "Turbidit",
                "shelf",
                "month",
                "condition",
                "Packaging",
                "10909090",
                "number",
                "usage",
                "control",
                "LIFE",
                "1000kg",
                "samples",
                "UFCl",
                "remaining",
                "moment",
                "e",
                "Granular",
                "Appearance",
                "Odor",
                "Additional",
                "100",
                "US",
                "statement",
                "Information",
                "COA",
                "container",
                "year",
                "Results",
                "product",
                "I",
                "ert",
                "AND",
                "day",
                "123456789",
                "plastic",
                "0",
                "h",
                "00",
                "Flavor",
                "Methodl",
                "logo",
                "its"
            ]
        },
        {
            "text_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-1.txt",
            "file_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/pages/a5eda780-316e-4eef-a977-046ebea76360-1.png",
            "hocr_path": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7/templates/25462914-2357-4833-957a-8a373a6d2eef/hocr/a5eda780-316e-4eef-a977-046ebea76360-1.hocr",
            "page_no": 1,
            "keywords": [
                "as",
                "have",
                "who",
                "oligosaccharides",
                "Value",
                "found",
                "influencing",
                "Yes",
                "Instrument",
                "19th",
                "substances",
                "sweeten",
                "Test",
                "In",
                "composed",
                "history",
                "ur",
                "include",
                "establishment",
                "nations",
                "namel",
                "1",
                "10",
                "granulated",
                "vulgaris",
                "known",
                "refers",
                "wars",
                "Feb",
                "name",
                "most",
                "needed",
                "Saccharum",
                "people",
                "a",
                "sugarcane",
                "giant",
                "Sensitive",
                "monosaccharides",
                "great",
                "The",
                "different",
                "labour",
                "been",
                "genus",
                "described",
                "the",
                "any",
                "uLAR",
                "many",
                "of",
                "climates",
                "to",
                "lower",
                "honey",
                "which",
                "DESCRIPTION",
                "short",
                "plantations",
                "types",
                "New",
                "03",
                "ingredients",
                "OCR",
                "table",
                "Certified",
                "transition",
                "controlling",
                "CHEMICAL",
                "perpetuation",
                "first",
                "human",
                "Area",
                "World",
                "ABC",
                "Insoluble",
                "UOM",
                "century",
                "Subcategory",
                "100000",
                "nl",
                "lb",
                "Avoidance",
                "Measure",
                "Validity",
                "lactose",
                "Americas",
                "Chemically",
                "II",
                "Moisture",
                "taste",
                "There",
                "course",
                "16",
                "Southeast",
                "South",
                "also",
                "REQUIRED",
                "production",
                "18th",
                "Longer",
                "species",
                "chain",
                "in",
                "indentured",
                "ethnic",
                "West",
                "SPECIFICATION",
                "major",
                "available",
                "Allergen",
                "Number",
                "DATA",
                "galactose",
                "Other",
                "PROPERTIES",
                "maltose",
                "Appr0ved",
                "but",
                "variety",
                "only",
                "This",
                "formation",
                "date",
                "Sugar",
                "generalized",
                "oxygen",
                "disaccharides",
                "Asia",
                "time",
                "used",
                "DUUAK",
                "food",
                "chains",
                "tropical",
                "root",
                "was",
                "Category",
                "nnnl",
                "condition",
                "into",
                "number",
                "may",
                "common",
                "migration",
                "cultivated",
                "between",
                "soluble",
                "plants",
                "Effective",
                "methods",
                "Replaces",
                "customarily",
                "ABCXO",
                "Sugars",
                "sufficient",
                "Sulphites",
                "Status",
                "derived",
                "called",
                "extraction",
                "100",
                "l",
                "150",
                "Substance",
                "glucose",
                "calorie",
                "COA",
                "ways",
                "substitutes",
                "ELI",
                "concentrations",
                "Results",
                "changed",
                "Beta",
                "Some",
                "0f",
                "I",
                "123456789",
                "sucrose",
                "impurities",
                "sweet",
                "place",
                "Page",
                "beet",
                "sugars",
                "several",
                "Indies",
                "Property",
                "r",
                "Outcome",
                "Tolerance",
                "ious",
                "sweeteners",
                "dextrose",
                "on",
                "Min",
                "grown",
                "ens",
                "Spices",
                "disaccharide",
                "INICAL",
                "and",
                "trade",
                "artificial",
                "various",
                "Reli",
                "cooler",
                "rely",
                "Target",
                "classified",
                "slavery",
                "SAP",
                "from",
                "structure",
                "or",
                "fructose",
                "its",
                "hydrolyses"
            ]
        }
    ],
    "no_of_pages": 3
}

test_mapping_doc = {
    "solution_id": "test_m_ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7",
    "template_id": "test_25462914-2357-4833-957a-8a373a6d2eef",
    "created_ts": "2018-04-12T07:49:29.884350",
    "updated_ts": "2018-04-12T07:49:29.884345",
    "sections": {
        "default": {
            "elements": {
                "349bb911-2316-4cfb-ad34-27a066b44095": {
                    "is_deleted": False,
                    "map_to": [
                        {
                            "is_doc_var": False,
                            "map_to": "XLS.Test_xls.SI_No"
                        },
                        {
                            "is_doc_var": False,
                            "map_to": "XLS.Test_xls.Date"
                        },
                        {
                            "is_doc_var": False,
                            "map_to": "XLS.Test_xls.Holiday"
                        },
                        {
                            "is_doc_var": False,
                            "map_to": "XLS.Test_xls.Holiday_Type"
                        },
                        {
                            "is_doc_var": False,
                            "map_to": "XLS.Test_xls.Weekday"
                        }
                    ]
                }
            }
        }
    },
    "section_id": "default"
}

test_section_doc = {
    "section_id" : "default",
    "solution_id": "test_m_ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7",
    "template_id": "test_25462914-2357-4833-957a-8a373a6d2eef",
    "start_identifier": {
        "text_marker": {"keywords": [],"headings": [],"is_header": False},
        "visual_marker": []},
    "updated_ts": "2018-04-09T16:06:22.664927",
    "pages": {"end": 1, "start": 1},
    "created_ts": "2018-04-09T16:06:22.664934",
    "end_identifier": {
        "text_marker": {"keywords" : [],"headings" : []},
        "visual_marker" : []},
    "name" : "default",
    "is_deleted" : False,
    "type" : "static"
}


def post_test_doc_temp(data=doc_temp_var):
    MongoDbConn.insert(TEMPLATE_COLLECTION, data)
    return "done"


def del_test_doc_temp(temp_solution_id=test_doc_temp_solution_id):
    MongoDbConn.remove(TEMPLATE_COLLECTION, {"solution_id": temp_solution_id})
    return True


def post_test_mapping_doc(data=test_mapping_doc):
    MongoDbConn.insert(MAPPING_COLLECTION, data)
    return "done"


def del_test_mapping_doc(temp_solution_id=test_doc_temp_solution_id):
    MongoDbConn.remove(MAPPING_COLLECTION, {"solution_id": temp_solution_id})
    return True


def post_test_sec_doc(data=test_section_doc):
    MongoDbConn.insert(SECTIONS_COLLECTION, data)
    return "done"


def del_test_sec_doc(temp_solution_id=test_doc_temp_solution_id):
    MongoDbConn.remove(SECTIONS_COLLECTION, {"solution_id": temp_solution_id})
    return True


input_convert_heirarchial_to_flat = {'description': '',
                                     'entity_cfg': [{'entity_name': 'test_m',
                                                     'entity_synonym': ['data'],
                                                     'entity_type': 'domain_object',
                                                     'attributes': [], 'type': ' '}],
                                     "old_domain_name":"test"}

output_convert_heirarchial_to_flat = [{'entity_name': 'test_m',
                                       'entity_synonym': ['data'],
                                       'entity_type': 'domain_object',
                                       'attributes': []}]

input_response={'status': 'success',
                'result': {'process_status': 'processed',
                           'result': {'metadata': {'failed_entities': []},
                                      'data': {'description': '',
                                               'entity_cfg': [{'attributes': [],
                                                               'entity_type': 'domain_object',
                                                               'entity_name': 'test_m',
                                                               'entity_synonym': ['data']}]
                                               }},
                           'status': {'code': 200,
                                      'success': True,
                                      'message': ''}},
                'status_code': 200}

negetive_response={'status': 'success',
                'result': {'process_status': 'processed',
                           'result': {'metadata': {},
                                      'data': {'description': '',
                                               'entity_cfg': [{'attributes': [],
                                                               'entity_type': 'domain_object',
                                                               'entity_name': 'test_m',
                                                               'entity_synonym': ['data']}]
                                               }},
                           'status': {'code': 200,
                                      'success': True,
                                      'message': ''}},
                'status_code': 200}