# Old to New
# todo: Get Old Template Element
# todo: Construct Element Tree from Old elements
# todo: Replace elements from Old to new.

# New to Old
# todo: Get New Template Object
# todo: Construct Element Tree in Old format
# todo: Serialise the Object

from copy import deepcopy
from uuid import uuid4

from xpms_objects.models.elements import *

elements_new = [{
    "justification": "",
    "parent_id": "492df195-ccd3-45ab-acb5-5f63040015ff",
    "insight_id": None,
    "is_deleted": False,
    "node_type": "default_section",
    "id": "492df195-ccd3-45ab-acb5-5f63040015ff",
    "confidence": 0,
    "is_best": True,
    "_XpmsObjectNode__type": "ElementTree",
    "regions": [{
        "x2": 2118,
        "page_number": 1,
        "x1": 0,
        "y1": 0,
        "y2": 205
    }],
    "text": "",
    "lang": "en-us",
    "children": [{
            "justification": "",
            "parent_id": "492df195-ccd3-45ab-acb5-5f63040015ff",
            "insight_id": None,
            "is_deleted": False,
            "node_type": "section",
            "id": "37c74682-bd2d-4d3c-a973-33be1c49c102",
            "confidence": 0,
            "is_best": True,
            "_XpmsObjectNode__type": "SectionElement",
            "regions": [{
                "x2": 2118,
                "page_num": 1,
                "x1": 0,
                "y1": 205,
                "y2": 2997
            }],
            "text": "",
            "lang": "en-us",
            "children": [
                {
                "justification": "",
                "parent_id": "37c74682-bd2d-4d3c-a973-33be1c49c102",
                "black_percent": 1.0819342803845602,
                "page_no": 1,
                "avg_word_width": 4.791666666666666,
                "center": False,
                "insight_id": "1234",
                "avg_word_height": 0,
                "regions": [{
                    "x2": 1489,
                    "page_num": 1,
                    "y2": 259,
                    "x1": 630,
                    "y1": 205
                }],
                "text": "ACME OFFICE SUPPLIES ",
                "lang": "en-us",
                "confidence": 0,
                "script": "en-us",
                "is_best": True,
                "right": False,
                "is_deleted": False,
                "node_type": "heading",
                "id": "130c0b9b-5ca8-4470-b964-6339e5c5f700",
                "cap": True,
                "children": [],
                "left": False,
                "_XpmsObjectNode__type": "HeadingElement",
                "generation_id": 187,
                "phrase_no": 1,
                "name": ""
            },
                {
                    "justification": "",
                    "parent_id": "37c74682-bd2d-4d3c-a973-33be1c49c102",
                    "insight_id": None,
                    "is_deleted": False,
                    "node_type": "field",
                    "value": {
                        "justification": "",
                        "parent_id": "3e0ad34c-451d-4781-8797-88d00e5939a1",
                        "insight_id": "456",
                        "is_deleted": False,
                        "node_type": "value",
                        "id": "3e0ad34c-451d-4781-8797-88d00e5939a1",
                        "confidence": 0,
                        "is_best": True,
                        "_XpmsObjectNode__type": "BaseElement",
                        "regions": [{
                            "x2": 459,
                            "page_num": 1,
                            "y2": 408,
                            "x1": 321,
                            "y1": 380
                        }],
                        "text": "INV0003 ",
                        "lang": "en-us",
                        "children": [],
                        "script": "en-us",
                        "generation_id": 386,
                        "name": ""
                    },
                    "id": "751ef8a3-1589-42c1-9765-b7fbd5b23f19",
                    "confidence": 0,
                    "is_best": True,
                    "_XpmsObjectNode__type": "FieldElement",
                    "regions": [],
                    "text": "",
                    "lang": "en-us",
                    "key": {
                        "justification": "",
                        "parent_id": "936252e9-fdad-4a50-b4ba-87c7b626d093",
                        "insight_id": "122344",
                        "is_deleted": False,
                        "node_type": "key",
                        "id": "936252e9-fdad-4a50-b4ba-87c7b626d093",
                        "confidence": 0,
                        "is_best": True,
                        "_XpmsObjectNode__type": "BaseElement",
                        "regions": [{
                            "x2": 304,
                            "page_num": 1,
                            "x1": 136,
                            "y1": 380,
                            "y2": 408
                        }],
                        "text": "Invoice # ",
                        "lang": "en-us",
                        "children": [],
                        "script": "en-us",
                        "generation_id": 936,
                        "name": ""
                    },
                    "children": [],
                    "script": "en-us",
                    "generation_id": 686,
                    "name": ""
                },
                {
                    "justification": "",
                    "parent_id": "37c74682-bd2d-4d3c-a973-33be1c49c102",
                    "insight_id": None,
                    "is_deleted": False,
                    "node_type": "sentence",
                    "id": "a23a6502-9a4e-4a85-86c3-70369253c14f",
                    "confidence": 0,
                    "is_best": True,
                    "_XpmsObjectNode__type": "SentenceElement",
                    "regions": [{
                        "x2": 630,
                        "page_num": 1,
                        "x1": 153,
                        "y1": 2361,
                        "y2": 2456
                    }],
                    "text": " Terms & Conditions  Payment is due within 15 days ",
                    "lang": "en-us",
                    "children": [],
                    "script": "en-us",
                    "generation_id": 208,
                    "name": "sentence_a23_0"
                }
            ],
            "script": "en-us",
            "generation_id": 366,
            "name": ""
        }],
    "script": "en-us",
    "generation_id": 734,
    "name": ""
}]
elements_old = []

template_old = {
  "solution_id": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1",
  "transitions": [],
  "doc_id": "85c6794b-30a2-42a8-b6fe-a93bfa225fe6",
  "children": [],
  "page_groups": [],
  "template_type": "known",
  "elements": [
    {
      "elements": [
        {
          "value_coordinates": {
            "y2": 461,
            "x2": 1406,
            "y1": 363,
            "x1": 74
          },
          "coordinates": [
            {
              "y2": 461,
              "x2": 1406,
              "y1": 363,
              "page_number": 1,
              "x1": 74
            }
          ],
          "page_no": 1,
          "name": "Insurance type",
          "is_multiGroup": False,
          "temp_id": "default_6b49fe40-9b24-4942-9b1c-78a884700dc6",
          "label": "",
          "domain_mapping": "claim.other_details.insurance_type",
          "is_deleted": False,
          "section_id": "default",
          "parameters": {
            "has_label": False
          },
          "confidence": 80,
          "is_variable_field": False,
          "type": "omr",
          "has_label": False,
          "element_id": "6b49fe40-9b24-4942-9b1c-78a884700dc6",
          "id": "6b49fe40-9b24-4942-9b1c-78a884700dc6",
          "groups": [
            {
              "options": [
                {
                  "coordinates": [
                    {
                      "y2": 451.828125,
                      "x2": 121,
                      "y1": 407.828125,
                      "page_number": 1,
                      "x1": 78
                    }
                  ],
                  "label": "MEDICARE"
                },
                {
                  "coordinates": [
                    {
                      "y2": 452.828125,
                      "x2": 306,
                      "y1": 407.828125,
                      "page_number": 1,
                      "x1": 260
                    }
                  ],
                  "label": "MEDICAID"
                },
                {
                  "coordinates": [
                    {
                      "y2": 453.828125,
                      "x2": 498,
                      "y1": 410.828125,
                      "page_number": 1,
                      "x1": 452
                    }
                  ],
                  "label": "TRICARE"
                },
                {
                  "coordinates": [
                    {
                      "y2": 451.828125,
                      "x2": 743,
                      "y1": 407.828125,
                      "page_number": 1,
                      "x1": 699
                    }
                  ],
                  "label": "CHAMPVA"
                },
                {
                  "coordinates": [
                    {
                      "y2": 452.828125,
                      "x2": 933,
                      "y1": 407.828125,
                      "page_number": 1,
                      "x1": 889
                    }
                  ],
                  "label": "GROUP HEALTH PLAN"
                },
                {
                  "coordinates": [
                    {
                      "y2": 450.828125,
                      "x2": 1150,
                      "y1": 408.828125,
                      "page_number": 1,
                      "x1": 1107
                    }
                  ],
                  "label": "FECA BLK LUNG"
                },
                {
                  "coordinates": [
                    {
                      "y2": 452.828125,
                      "x2": 1316,
                      "y1": 409.828125,
                      "page_number": 1,
                      "x1": 1272
                    }
                  ],
                  "label": "OTHER"
                }
              ],
              "is_multiOption": True
            }
          ]
        },
        {
          "score": 80,
          "value_coordinates": {
            "y2": 639,
            "x2": 858,
            "y1": 547,
            "x1": 77
          },
          "temp_id": "default_a58e7503-39c2-476b-a239-8c7a6568aec7",
          "label_coordinates": {
            "y2": 573,
            "x2": 471,
            "y1": 553,
            "x1": 83
          },
          "coordinates": [
            {
              "y2": 640,
              "x2": 860,
              "y1": 547,
              "page_number": 1,
              "x1": 77
            }
          ],
          "type": "field",
          "is_variable_field": False,
          "name": "Patient address",
          "slice_path": "",
          "text": "5. PATIENT'S ADDRESS (Ne. SITEEI)",
          "label": "5. PATIENT'S ADDRESS (Ne. SITEEI)",
          "domain_mapping": "claim.patient.address",
          "is_deleted": False,
          "section_id": "default",
          "parameters": {
            "has_label": True,
            "label_coordinates": [
              {
                "y2": 573,
                "x2": 471,
                "y1": 553,
                "page_number": 1,
                "x1": 83
              }
            ],
            "label": "5. PATIENT'S ADDRESS (Ne. SITEEI)",
            "text": "5. PATIENT'S ADDRESS (Ne. SITEEI)",
            "is_variable_field": False
          },
          "confidence": 80,
          "page_no": 1,
          "has_label": "yes",
          "id": "a58e7503-39c2-476b-a239-8c7a6568aec7",
          "element_id": "a58e7503-39c2-476b-a239-8c7a6568aec7"
        },
        {
          "score": 80,
          "value_coordinates": {
            "y2": 726,
            "x2": 757,
            "y1": 638,
            "x1": 75
          },
          "temp_id": "default_eacb9e9d-5877-4968-b157-ce3f71e67a0d",
          "label_coordinates": {
            "y2": 665,
            "x2": 136,
            "y1": 648,
            "x1": 87
          },
          "coordinates": [
            {
              "y2": 726,
              "x2": 757,
              "y1": 638,
              "page_number": 1,
              "x1": 75
            }
          ],
          "type": "field",
          "is_variable_field": False,
          "name": "Patient city",
          "slice_path": "",
          "text": "CITY",
          "label": "CITY",
          "domain_mapping": "claim.patient.city",
          "is_deleted": False,
          "section_id": "default",
          "parameters": {
            "has_label": True,
            "label_coordinates": [
              {
                "y2": 665,
                "x2": 136,
                "y1": 648,
                "page_number": 1,
                "x1": 87
              }
            ],
            "label": "CITY",
            "text": "CITY",
            "is_variable_field": False
          },
          "confidence": 80,
          "page_no": 1,
          "has_label": True,
          "id": "eacb9e9d-5877-4968-b157-ce3f71e67a0d",
          "element_id": "eacb9e9d-5877-4968-b157-ce3f71e67a0d"
        }
      ],
      "temp_id": "default",
      "start_identifier": {
        "text_marker": {
          "is_header": False,
          "keywords": [],
          "headings": []
        },
        "visual_marker": []
      },
      "name": "section",
      "is_deleted": False,
      "end_identifier": {
        "text_marker": {
          "headings": [],
          "keywords": []
        },
        "visual_marker": []
      },
      "parameters": {},
      "confidence": 80,
      "type": "section",
      "section_id": "default",
      "id": "default",
      "pages": {
        "start": 1,
        "end": 1
      }
    }
  ],
  "document_variables": {},
  "template_name": "CMS",
  "doc_state": "ready",
  "is_draft": True,
  "is_test": False,
  "metadata": {
    "properties": {
      "extension": ".png",
      "is_digital_pdf": False,
      "pdf_resource": {
        "storage": "efs",
        "class": "EfsResource",
        "bucket": "/efs",
        "key": ""
      },
      "file_resource": {
        "storage": "efs",
        "class": "EfsResource",
        "bucket": "/efs",
        "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/multiOMR_CMS-1.png"
      },
      "num_pages": 1,
      "digital_pdf_resource": {
        "storage": "efs",
        "class": "EfsResource",
        "bucket": "/efs",
        "key": ""
      },
      "filename": "multiOMR_CMS-1.png",
      "email_info": {},
      "size": 1402121
    },
    "template_info": {
      "score": 0,
      "name": "unknown",
      "id": "unknown",
      "template_type": "unknown"
    }
  },
  "is_deleted": False,
  "processing_state": "template_updated",
  "is_root": True,
  "is_template": True,
  "root_id": "85c6794b-30a2-42a8-b6fe-a93bfa225fe6",
  "domain_object_mapping": {
    "6b49fe40-9b24-4942-9b1c-78a884700dc6": [
      {
        "attribute": "insurance_type",
        "domain_object": "claim.other_details"
      }
    ],
    "a58e7503-39c2-476b-a239-8c7a6568aec7": [
      {
        "attribute": "address",
        "domain_object": "claim.patient"
      }
    ],
    "eacb9e9d-5877-4968-b157-ce3f71e67a0d": [
      {
        "attribute": "city",
        "domain_object": "claim.patient"
      }
    ]
  },
  "pages": {
    "1": {
      "num": 1,
      "metadata": {
        "hocr": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/col_17_multiOMR_CMS-1.hocr"
        },
        "preprocess": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/col_17_multiOMR_CMS-1.png"
        },
        "text": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/col_17_multiOMR_CMS-1.txt"
        },
        "raw": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/multiOMR_CMS-1.png"
        },
        "deskew": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/deskew-multiOMR_CMS-1.png"
        },
        "keywords": {
          "storage": "efs",
          "class": "EfsResource",
          "bucket": "/efs",
          "key": "structuredocuments_d323bf68-26b9-407a-ac09-68073122d7c1/documents/85c6794b-30a2-42a8-b6fe-a93bfa225fe6/pages/multiOMR_CMS-1_keywords.json"
        }
      }
    }
  }
}

template_new = deepcopy(template_old)


def transform_old_to_new_elements(elements, root=None):
    root = ElementTree() if not root else root
    for e in elements:
        cords = [dict(x1=a["x1"], x2=a["x2"], y1=a["y1"], y2=a["y2"], page_num=a["page_number"])
                 for a in e["coordinates"]] if "coordinates" in e else []
        if e["type"] == "section":
            root = SectionElement(parent=root, id=e["id"], node_type="section")

        elif e["type"] == "omr":
            el = OmrField(parent=root, id=e["id"], name=e["name"], regions=cords, node_type="omr")
            el.fields = list()
            group = e["groups"][0] if "groups" in e and len(e["groups"]) > 0 else {}
            for o in group["options"]:
                o_el = FieldElement(id=str(uuid4()), node_type="omr_field")
                o_el.key.regions = o["coordinates"]
                o_el.key.name = o["label"]
                el.fields.append(o_el)

        elif e["type"] == "field":
            el = FieldElement(parent=root, id=e["id"], name=e["name"], regions=cords, node_type="field")
            el.value.regions = cords
            if "has_label" in e and e["has_label"]:
                region = e["label_coordinates"]
                region["page_number"] = e["page_no"]
                el.key.regions = [region]

        if "elements" in e and len(e["elements"]) > 0:
            transform_old_to_new_elements(e["elements"], root)

    return root.as_json(serialize=True)


def transform_new_to_old_elements(elements):
    for i, e in enumerate(elements):
        if e["node_type"] == "section":

            pass

        elif e["node_type"] == "omr":
            pass

        elif e["node_type"] == "field":
            pass

    return elements


def construct_old_section(element):
    _inp = {
      "elements": list(),
      "temp_id": "default",
      "start_identifier": {
        "text_marker": {
          "is_header": False,
          "keywords": [],
          "headings": []
        },
        "visual_marker": []
      },
      "name": "section",
      "is_deleted": False,
      "end_identifier": {
        "text_marker": {
          "headings": [],
          "keywords": []
        },
        "visual_marker": []
      },
      "parameters": {},
      "confidence": 80,
      "type": "section",
      "section_id": "default",
      "id": "default",
      "pages": {
        "start": 1,
        "end": 1
      }
    }

if __name__ == "__main__":
    new_tree = transform_old_to_new_elements(template_old["elements"])
    print(new_tree)
