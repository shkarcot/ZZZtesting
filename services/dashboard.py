from django.http import JsonResponse
from bson import ObjectId
from datetime import datetime, timedelta, date
from config_vars import STEPS, CLAIMS_COLLECTION, DASHBOARD_CONFIG, CLAIMS_FIELDS_COLLECTION,\
    MEDIA_ROOT,DOCUMENTS_COLLECTION, SERVICE_NAME
from connections.mongodb import MongoDbConn
from utilities.common import get_solution_from_session, get_pagination_details
from django.http import StreamingHttpResponse
from wsgiref.util import FileWrapper
import re, json, mimetypes, os
import pandas as pd
from dateutil import parser
from utilities import common
from config_vars import CASE_QUEUE_COLLECTION, CASE_MANAGEMENT_SERVICE_URL, KEY_CLOAK_API_URI
from xpms_common import trace
import traceback
from uuid import uuid4
from services.user_services import UserServices
import requests

tracer = trace.Tracer.get_instance(SERVICE_NAME)


chart_filter = {"wtd":{"interval":7,"aggr":"date"},"mtd":{"interval":31,"aggr":"date"},"ytd":{"interval":365,"aggr":"month"},"custom":{"aggr":{60:"date",600:"month"}}}
doc_state = [{"state":"classified","Accuracy":97,"queue":30,"display":"Needs Classification","description":"Need classification","time_in_queue":10,"show_in":"tab"},
             {"state": "processing", "Accuracy": 97, "queue": 30, "display": "Processing","description":"processing","time_in_queue":10,"show_in":"all"},
             {"state": "extracted", "Accuracy": 97, "queue": 30, "display": "Extraction", "description": "extraction",
              "time_in_queue": 10, "show_in": "tab"},
             {"state": "entity_linked", "Accuracy": 97, "queue": 30, "display": "Annotation & Entity Linking",
              "description": "Review Annotation & Entity Linking",
              "time_in_queue": 10, "show_in": "tab"},
             {"state": "processed", "Accuracy": 97, "queue": 30, "display": "Post Processing","description":"processed","time_in_queue":10,"show_in":"all"},
             {"state": "reviewed", "Accuracy": 97, "queue": 30, "display": "Reviewed","description":"reviewed","time_in_queue":10,"show_in":"all"},
             {"state": "failed", "Accuracy": 97, "queue": 30, "display": "Error", "show_in": "graph"}]

doc_state_changes_dict = {'classified': ['classified', 'extracted', 'processed', 'post_processed'],
                          'extracted': ['extracted', 'processed', 'post_processed'],
                          'processed': ['processed', 'post_processed'],
                          'post_processed': ['post_processed']}

def get_charts(request):

    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        if "charts" in payload:
            if payload["charts"] != ["tab_data"]:
                start_ts, end_ts, aggr = get_date_range(payload)
                document_df = get_all_document_df(start_ts, end_ts, solution_id)
            dashboard = {}
            for chart in payload["charts"]:
                if chart == "document":
                    dashboard["graph"] = {}
                    document_info = get_document_graph(document_df,start_ts, end_ts,aggr)
                    dashboard["graph"]["document_summary"] = document_info
                if chart == "tab_data":
                    # Extracting dashboard data from case-management API
                    # url = CASE_MANAGEMENT_URL + \
                    #       CASE_MANAGEMENT_ENDPOINT["doc_state"] + \
                    #       solution_id
                    # Getting case-management GET API response
                    # getResp = httpGet(url)
                    # Processing case-management API response
                    #dashboard = processHttpGetResponse(getResp, dashboard)
                    dashboard["tab_data"] = [item for item in doc_state if item["show_in"] in ["all", "tab"]]
        return {"status":"success","data":dashboard,"msg":"Generated data successfully"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal error occurred while processing","error":str(e)}
    finally:
        context.end_span()


def get_date_range(payload):
    if "chart_filter" in payload and payload["chart_filter"] in chart_filter.keys():
        chart_info = chart_filter[payload["chart_filter"]]
    else:
        ### defaulting to month to date
        chart_info = chart_filter["mtd"]
    if "interval" in chart_info:
        end_ts = datetime.utcnow().isoformat()
        start_ts = parser.parse(end_ts) + timedelta(days=-(chart_info["interval"]-1))
        start_ts = start_ts.isoformat()
        aggr = {"aggr":chart_info["aggr"],"interval":chart_info["interval"]}
    else:
        if "date_range" in payload:
            date_range = payload["date_range"]
            start_ts = (parser.parse(date_range["start_date"]))
            end_ts = (parser.parse(date_range["end_date"])) + timedelta(days=1)
            interval = (end_ts - start_ts).days
            start_ts = start_ts.isoformat()
            end_ts = end_ts.isoformat()
            if interval > 90:
                aggr_by = "month"
            else:
                aggr_by = "date"
            aggr = {"aggr":aggr_by,"interval":interval}
    return start_ts, end_ts, aggr


def get_all_document_df(start_ts,end_ts,solution_id):
    reqd_states = [item["state"] for item in doc_state if item["show_in"] in ["all","graph"]]
    query = {"created_ts":{"$lte":end_ts,"$gte":start_ts},"solution_id":solution_id,"$or":[{"is_test":False},{"is_test":{"$exists":False}}]}
    documents = MongoDbConn.find(DOCUMENTS_COLLECTION,query)
    document_df = pd.DataFrame(list(documents))
    if not document_df.empty:
        document_df["created_ts"] = document_df['created_ts'].apply(lambda x: parser.parse(x))
        document_df = document_df[document_df["doc_state"].isin(reqd_states)]
    else:
        document_df = pd.DataFrame({"created_ts":[],"doc_state":[]})
    return document_df


def get_document_graph(doc_df,start_ts,end_ts,aggr):
    start_ts = parser.parse(start_ts)
    end_ts = parser.parse(end_ts)
    process_counts = doc_df.groupby(["doc_state"]).size().to_frame(name = "count").reset_index()
    count_df = get_required_states(process_counts)
    count_df["percentage"] = round((100 * count_df['count']  / count_df['count'].sum()),2)
    count_df = count_df.fillna(0)
    count_data = count_df.to_dict('records')

    all_dates = pd.DataFrame({"date": pd.date_range(start_ts.date(), end_ts.date()), "doc_state": ""})

    if aggr["aggr"] == "month":
        all_dates = get_year_month(all_dates,"date")
        all_dates.drop_duplicates(inplace=True)
        doc_df = get_year_month(doc_df,"created_ts")
    elif aggr["aggr"] == "date":
        all_dates["date"] = all_dates["date"].apply(lambda x: x.date())
        doc_df["date"] = doc_df["created_ts"].apply(lambda x: x.date())

    return {"stats":count_data,"graph":generate_graph_data(doc_df, all_dates)}


def generate_graph_data(doc_df,all_dates):
    graph_counts = doc_df.groupby(["doc_state", "date"]).size().to_frame(name="count").reset_index()
    data = dict(labels=all_dates["date"].tolist())
    for state in doc_state:
        if state["show_in"] in ["all", "graph"]:
            proc_df = all_dates
            proc_df["doc_state"] = state["state"]
            graph_df = pd.merge(proc_df, graph_counts, on=["date", "doc_state"], how="left")
            graph_df = graph_df.fillna(0)
            data[state["state"]] = graph_df["count"].tolist()
    return data


def get_year_month(df,date_field):
    df["year"] = df[date_field].dt.year
    df["month"] = df[date_field].dt.month
    df["date"] = df["year"] * 100 + df["month"]
    df = df.drop(["year","month"],axis=1)
    return df

def get_required_states(process_counts):
    reqd_states = pd.DataFrame([item for item in doc_state if item["show_in"] in ["all","graph"]])
    final_df = reqd_states[["state","display"]].merge(process_counts,left_on="state",right_on="doc_state",how="left")
    final_df = final_df.fillna(0)
    return final_df


def generate_data(solution_id, selector=None, file_id=None, direction=None, doc_type=None, rec_selector=None, query_string=""):
    if file_id is not None:
        query = {"table": "DocumentDetails"}
        if rec_selector is not None:
            time_frame = set_timeframe(rec_selector)
            data = get_flow_id(file_id=file_id, direction=direction, time_frame=time_frame, doc_type=doc_type,
                               query_string=query_string)
            data["solution_id"] = solution_id
            return JsonResponse(data_response(query, data))

    elif selector is not None:
        query = {"table": "DocumentsList"}
        data = set_timeframe(selector)
        if doc_type != "all":
            data["doc_type"] = doc_type
        if query_string != "":
            data["file_name"] = {"$regex": query_string, '$options': 'i'}
        data["solution_id"] = solution_id
        return JsonResponse(data_response(query, data))


def set_timeframe(selector):
    end_day = datetime.now().replace(hour=23, minute=59, second=59)
    iterlen = get_iters(selector)['length']
    iterstep = get_iters(selector)['step']
    start_day = end_day + timedelta(days=-iterstep * iterlen)
    query = {"timestamp": {'$lte': end_day, '$gte': start_day}}
    return get_file_ids_from_timeframe(query)


def get_flow_id(file_id, direction, doc_type, status=None, time_frame=None, query_string=None):
    record = MongoDbConn.find_one(CLAIMS_COLLECTION, {"flow_file_id": file_id})
    disable_prev = False
    disable_next = False
    timestamp = start_timeframe = end_timeframe = None
    if record is not None and "_id" in record.keys():
        timestamp = ObjectId(str(record["_id"]))
    if time_frame is not None:
        end_timeframe = time_frame["_id"]["$gte"]
        start_timeframe = time_frame["_id"]["$lte"]
    query = dict()
    if doc_type != "all":
        query["doc_type"] = doc_type
    if query_string is not None and query_string != "":
        query["file_name"] = {"$regex": query_string, '$options': 'i'}

    if status == 'processed':
        query["$or"] = [{"status": {"$regex": 'processed', '$options': 'i'}}]
    elif status == "all":
        query["$or"] = [{"status": {"$regex": 'processed', '$options': 'i'}}, {"status": 'reviewed'}]
    else:
        query["status"] = {"$nin": ["Pending", "pending"]}

    if direction == "next" and timestamp is not None:
        if end_timeframe is not None:
            query["_id"] = {'$lt': timestamp, "$gte": end_timeframe}
        else:
            query["_id"] = {'$lt': timestamp}
        result = MongoDbConn.find(CLAIMS_COLLECTION, query).sort("_id", -1).limit(2)
        if result.count() <= 1:
            disable_next = True
    elif direction == 'prev' and timestamp is not None:
        if start_timeframe is not None:
            query["_id"] = {"$lte": start_timeframe,'$gt': timestamp}
        else:
            query["_id"] = {'$gt': timestamp}
        result = MongoDbConn.find(CLAIMS_COLLECTION, query).sort("_id", 1).limit(2)
        if result.count() <= 1:
            disable_prev = True
    else:
        result = None
        if end_timeframe is not None and start_timeframe is not None:
            query_one = dict({"_id": {'$lt': timestamp, "$gte": end_timeframe}})
            query_two = dict({"_id": {'$gt': timestamp, "$lte": start_timeframe}})
        else:
            query_one = dict({"_id": {'$lt': timestamp}})
            query_two = dict({"_id": {'$gt': timestamp}})

        if "$or" in query.keys():
            query_one["$or"] = query_two["$or"] = query["$or"]
        else:
            query_one["status"] = query_two["status"] = query["status"]
        if "doc_type" in query.keys():
            query_one["doc_type"] = query_two["doc_type"] = query["doc_type"]
        if "file_name" in query.keys():
            query_one["file_name"] = query_two["file_name"] = query["file_name"]
        result_one = MongoDbConn.find(CLAIMS_COLLECTION, query_one).sort("_id", 1).limit(1)
        result_two = MongoDbConn.find(CLAIMS_COLLECTION, query_two).sort("_id", 1).limit(1)

        if result_one.count() <= 0:
            disable_next = True
        if result_two.count() <= 0:
            disable_prev = True
    if result is not None and result.count() > 0:
        file_id = result[0]["flow_file_id"]
    return {"flow_file_id": file_id, "disable_prev": disable_prev, "disable_next": disable_next}


def data_response(query, data):
    rows = MongoDbConn.find_one(DASHBOARD_CONFIG, query)
    response = dict()
    detail = dict()
    if "config2" in rows.keys() and "collection2" in rows.keys():
        rec_data = dict()
        rec_data.update(data)
        del data["disable_prev"]
        del data["disable_next"]
        record = MongoDbConn.find_one(rows['collection2'], query=data)
        for itm in rows['config2']:
            if record is not None:
                rec_data[itm["key"]] = get_value(itm['value'], record)
                if itm['key'] == "Confidence" and rec_data[itm["key"]] is not None:
                    rec_data[itm["key"]] = str(round(get_score(itm, rec_data[itm["key"]]), 2)) + "%"
                if itm['key'] == "Received" and rec_data[itm["key"]] is not None:
                    rec_data[itm["key"]] = str(conv_timestamp(rec_data[itm["key"]]))
                if itm['key'] == "Status" and rec_data[itm["key"]].lower() == "error" and 'error' in record.keys():
                    rec_data['error'] = record['error']
                if "doc_type" in record.keys() and record["doc_type"] == "Email":
                    detail["html_data"] = record["html_data"]
                    detail["attachments"] = record["attachments_path"]
                    detail["body"] = record["body"]
                if "doc_type" in record.keys() and record["doc_type"] == "unknown":
                    detail["html_data"] = [get_html_from_json(record["data"])]
                    rec_data["Link"] = record['file_path']
        response["record_data"] = rec_data
    resp = list()
    result = MongoDbConn.find(rows['collection'], query=data).sort("_id", -1)
    for rec in result:
        row_data = list()
        for field in rows['config']:
            row = common.construct_dictionary(field, ["key", "type", "order"])
            if rec is not None:
                row['value'] = get_value(field['value'], rec)
                if row['value'] is None and field["key"] != "Review":
                    row = update_row(row, rows['config'], rec)
                if field['type'] == 'link':
                    row['url'] = str(rec["flow_file_id"])
                if field['key'] == "Status" and row['value'].lower() == "error" and 'error' in rec.keys():
                    row['error'] = rec['error']
                if field['key'] == "Confidence" and row['value'] is not None:
                    row['value'] = str(round(get_score(field, row["value"]), 2)) + "%"
                if field['key'] == "Received" and row['value'] is not None:
                    row["value"] = str(conv_timestamp(row["value"]))
                if field["key"] == "Review" and str(get_status(field, data)).lower() != "reviewed":
                    row = None
                if row is not None:
                    row_data.append(row)
        resp.append(row_data)
    if resp:
        response['details'] = resp
    elif detail:
        response["details"] = [detail]
    response["count"] = result.count()
    return response


def get_iters(selector):
    m = re.match(r"([0-9]+)([a-zA-Z]+)", str(selector))
    resp = dict()
    resp['length'] = eval(m.group(1))
    resp['step'] = STEPS[str(m.group(2)).strip()]
    return resp


def get_file_ids_from_timeframe(timeframe):
    result = MongoDbConn.find(CLAIMS_COLLECTION, timeframe).sort("_id", -1)
    if result is not None and result.count() > 0:
        return {"_id": {"$gte": ObjectId(str(result[result.count()-1]["_id"])), "$lte": ObjectId(str(result[0]["_id"]))}}
    else:
        return {}


def get_value(key, rec):
    row_vals = list()
    if rec is not None:
        for itm in prep_fields(key):
            if "+" in itm:
                val = return_file_extn(itm, rec)
            elif itm == 'name':
                val = return_field_id(itm, rec)
            else:
                val = return_value(itm, rec)
            if val is not None:
                row_vals.append(val)

        if len(row_vals) == 1:
            val = row_vals[0]
        elif len(row_vals) == 0:
            val = None
        else:
            val = row_vals
        return val


def update_row(row, list_rows, rec):
    for field in list_rows:
        if field['key'] == row['key'] and "error_value" in field.keys():
            row['value'] = get_value(field['error_value'], rec)
    row['status'] = 'error'
    return row


def get_score(field, flow_file_id):
    result = MongoDbConn.find(field['score_collection'], {"flow_file_id": str(flow_file_id)})
    scores = list()
    for rec in result:
        value = get_value(field['score_key'], rec)
        if value is not None and value != "NA" and not isinstance(value, list):
            scores.append(float(value))
    scores = [val for val in scores if val != 0.0]
    return float(sum(scores)) / max(len(scores), 1)


def conv_timestamp(timestamp):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        return datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S.%f").strftime("%Y-%m-%d %H:%M:%S")
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return timestamp
    finally:
        context.end_span()


def get_status(field, data):
    if "parent_collection" in field.keys() and "parent_key" in field.keys():
        result = MongoDbConn.find_one(field['parent_collection'], query=data)
        if result is not None:
            return result[field["parent_key"]]


def get_json_download(flow_file_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        form_data = MongoDbConn.find_one(CLAIMS_COLLECTION, {"flow_file_id": flow_file_id})
        form_field_data = MongoDbConn.find(CLAIMS_FIELDS_COLLECTION, {"flow_file_id": flow_file_id})
        data = dict()
        if form_data is not None:
            if {"file_name", "doc_type", "timestamp"}.issubset(set(form_data.keys())):
                data.update({'file_name': form_data['file_name'],
                             "doc_type": form_data["doc_type"],
                             "timestamp": str(form_data["timestamp"])})
            if form_data["doc_type"] in ["Email", "unknown"] and "data" in form_data.keys():
                data.update({"data": form_data["data"]})
            else:
                att_data = dict()
                if form_field_data is not None:
                    for field in form_field_data:
                        if {"name", "iocr_text"}.issubset(set(field.keys())):
                            att_data[field["name"]] = {"value": get_value("iocr_text.text", field),
                                                           "score": eval(get_value("iocr_text.score", field))}
                        if "reviewed" in field.keys():
                            att_data[field["name"]] = {"value": get_value("reviewed.value", field),
                                                           "score": eval(get_value("iocr_text.score", field))}
                data.update({"fields": att_data})
        file_path = MEDIA_ROOT + str(flow_file_id + ".json")
        with open(file_path, 'w') as outfile:
            json.dump(data, outfile)
            outfile.close()
        # Streaming data to download
        chunk_size = 8192
        response = StreamingHttpResponse(FileWrapper(open(file_path, 'rb'), chunk_size),
                                         content_type=mimetypes.guess_type(file_path)[0])
        response['Content-Length'] = os.path.getsize(file_path)
        response['Content-Disposition'] = "attachment; filename=%s" % str(flow_file_id + ".json")
        return response
    # TODO raise specific exception
    except Exception as e:
        traceback.print_exc()
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def get_html_from_json(json_data):
    table_data = list()
    for table in json_data[0]:
        html = ''''''
        if isinstance(table, dict) and {"type", "table_name"}.issubset(set(table.keys())):
            temp = {"sheet_name": table["table_name"], "sheet_type": table["type"]}
            if "is_header_exists" in table.keys() and table["is_header_exists"] and "text" in table.keys():
                html += "<table class= table table-bordered table-hover table-responsive>"
                for row in table["text"]:
                    html += "<tr>"
                    for itm in row:
                        html += "<td>" + itm["text"] + "</td>"
                    html += "</tr>"
                html += "</table>"
            temp['data'] = str(html)
            table_data.append(temp)
    return {"heading": "Image table data", "type": "unknownImage", "data": table_data}


def prep_fields(key):
    fields_list = list()
    if "," in key:
        row_keys = key.split(",")
    else:
        row_keys = [key]
    for k in row_keys:
        if "." in k.strip():
            vals = k.strip().split(".")
            fields_list.append(vals)
        else:
            fields_list.append(k)
    return fields_list


# Checks if the field is a string or a list of values
def return_value(field, rec):
    if isinstance(field, list):
        return iterate_keys(field, rec)
    elif field in rec.keys() and isinstance(rec[field], (str, int, float, ObjectId, date)):
        return str(rec[field.strip()])


# If field is a string then loops over the object to find the innermost value using the list of strings.
# If value is a list returns a string after joining all elements separated by comma.
def iterate_keys(key_list, rec):
    for key in key_list:
        if key in rec.keys() and isinstance(rec[key], dict):
            return iterate_keys(key_list[1:], rec[key])
        elif key.strip() in rec.keys() and isinstance(rec[key.strip()], (str, int, float, ObjectId, date)):
            return str(rec[key.strip()])
        elif key.strip() in rec.keys() and isinstance(rec[key.strip()], list):
            if key_list.index(key.strip()) != len(key_list)-1 and key_list[key_list.index(key.strip()) + 1] == "$":
                return iterate_keys(key_list[2:], rec[key.strip()][len(rec[key.strip()])-1])
            elif key_list.index(key.strip()) != len(key_list)-1 and key_list[key_list.index(key.strip()) + 1] == "#":
                return rec[key.strip()]
            else:
                return ",".join(rec[key.strip()]).strip()


def return_file_extn(field, rec):
    fields = field.strip().split("+")
    val = list()
    for itm in fields:
        val.append(str(return_value(itm, rec)))
    return ".".join(val).strip()


def return_field_id(itm, rec):
    val = return_value(itm, rec)
    if "_" in str(val):
        val = [i.strip() for i in val.split("_") if i != "_"]
    if isinstance(val,list):
        return " ".join(val).strip().title()
    else:
        return val


def get_dashboard_queues_info(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "POST":
            try:
                payload = json.loads(request.body.decode())
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                payload = request.POST
            overall_closed_doc_list, overall_inprogress_doc_list = [], []
            overall_new_doc_list, overall_unassigned_doc_list = [], []
            user_name = payload["user_name"]
            role = payload["role"]
            searched_text = None
            if 'searched_text' in payload:
                searched_text = payload['searched_text']
            documents = get_all_documents(solution_id)
            documents = [document for document in documents]
            if searched_text and searched_text.strip() != '':
                documents = get_filtered_docs(documents, searched_text.lower())
            # documents = get_all_documents(solution_id, searched_text)
            queues_list = get_all_queues_documents(solution_id,documents)
            overall_list = []
            for queue in queues_list:
                if queue["queue_id"] != "uncategorized":
                    if role == "bu":
                        if user_name not in queue["agents"]:
                            continue
                    else:
                        if user_name not in queue["supervisor"]:
                            continue
                queue_dict = dict(queue_id=queue["queue_id"],queue_name=queue["queue_name"],state=queue["processing_state"],
                                  closed=queue["closed_count"])
                documents_list = queue["documents_list"]
                temp_unassigned=[]
                for document in documents_list:
                    if document["status"] == "New" and document["assignee"] == None:
                        temp_unassigned.append(document["doc_id"])
                queue_dict["new_unassigned"] = len(temp_unassigned)
                overall_unassigned_doc_list.extend(temp_unassigned)
                temp_new, temp_inprogress = [], []
                if role == 'bu':
                    for document in documents_list:
                        if document["status"] == "New" and document["assignee"] == user_name:
                            temp_new.append(document['doc_id'])
                        elif document["status"] == "In Progress" and document["assignee"] == user_name:
                            temp_inprogress.append(document['doc_id'])
                    queue_dict["new"] = len(temp_new)
                    queue_dict["in_progress"] = len(temp_inprogress)
                else:
                    for document in documents_list:
                        if document["status"] == "New" and document['is_assigned']:
                            temp_new.append(document['doc_id'])
                        elif document["status"] == "New" and document['is_assigned']:
                            temp_inprogress.append(document['doc_id'])
                    queue_dict["new"] = len(temp_new)
                    queue_dict["in_progress"] = len(temp_inprogress)

                overall_new_doc_list.extend(temp_new)
                overall_inprogress_doc_list.extend(temp_inprogress)
                if 'closed_documents_list' in queue:
                    overall_closed_doc_list.extend(queue['closed_documents_list'])
                overall_list.append(queue_dict)
            overall_unassigned_count = len(set(overall_unassigned_doc_list))
            overall_new_count = len(set(overall_new_doc_list))
            overall_inprogress_count = len(set(overall_inprogress_doc_list))
            overall_closed_count = len(set(overall_closed_doc_list))
            overall_count = {'overall_new_count': overall_new_count,
                             'overall_inprogress_count': overall_inprogress_count,
                             'overall_closed_count': overall_closed_count,
                             'overall_unassigned_count': overall_unassigned_count}
            return {"status": "success", "queues": overall_list,"stats": overall_count}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Error while retrieving the queue information", "error": str(e)}
    finally:
        context.end_span()


def get_all_queues_documents(solution_id,all_documents):
    query = {'is_deleted': False, "solution_id":solution_id}
    queues = MongoDbConn.find(CASE_QUEUE_COLLECTION, query).sort('modified_ts', -1)
    queues_list = []
    for queue in queues:
        if isinstance(queue["processing_state"], list):
            queue["documents_list"] = []
            queue["closed_documents_list"] = []
            queue["closed_count"] = 0
            queue['root'] = {}
            queues_list.append(queue)
    queues_list = map_all_documents(queues_list, all_documents)
    return queues_list


def map_all_documents(queues_list,documents_list):
    uncategorized_queue = dict(queue_id="uncategorized", queue_name="uncategorized queue",
                               processing_state=[], documents_list=[], total_documents=0,closed_count=0,
                               closed_documents_list=[], root={})
    for document in documents_list:
        try:
            if 'root_id' not in document:
                continue
            added = False
            uncat_close_added = False
            group_templates = []
            if document["metadata"]["template_info"]["id"] == "" and "page_groups" in document:
                if document["page_groups"]:
                    for group in document["page_groups"]:
                        if "template_id" in group:
                            group_templates.append(group["template_id"])
            for queue in queues_list:
                if document["doc_state"] in queue["processing_state"] \
                        and ("all" in queue["document_type"] or
                             ("template_id" in document and document["template_id"] in queue["document_type"]) or
                             ("template_id" not in document and (set(group_templates) & set(queue["document_type"])))):
                    if document['root_id'] == document['doc_id']:
                        document_updated = update_document_info(document)
                    else:
                        if document['root_id'] not in queue['root']:
                            root_doc = get_root_documents(document['root_id'], documents_list)
                            queue['root'][document['root_id']] = root_doc
                        else:
                            root_doc = queue['root'][document['root_id']]
                        document_updated = update_document_info(root_doc)
                    if document_updated not in queue['documents_list']:
                        queue["documents_list"].append(document_updated)
                    added = True
                else:
                    doc_state = document["doc_state"]
                    if "life_cycle" in document:
                        life_cycle = document["life_cycle"]
                        if doc_state in life_cycle:
                            data = life_cycle[doc_state]
                            if "queue_id" in data and data["queue_id"] == queue["queue_id"]:
                                if document['root_id'] == document['doc_id']:
                                    document_updated = update_document_info(document)
                                else:
                                    if document['root_id'] not in queue['root']:
                                        root_doc = get_root_documents(document['root_id'], documents_list)
                                        queue['root'][document['root_id']] = root_doc
                                    else:
                                        root_doc = queue['root'][document['root_id']]
                                    document_updated = update_document_info(root_doc)
                                if document_updated not in queue['documents_list']:
                                    queue["documents_list"].append(document_updated)
                                added = True

                if "life_cycle" in document:
                    life_cycle = document["life_cycle"]
                    close_doc_added = False
                    for state in life_cycle:
                        queue_data = life_cycle[state]
                        if isinstance(queue_data,dict) and queue_data["status"] == "Closed":
                            if queue_data["queue_id"] == queue["queue_id"] and not close_doc_added:
                                queue["closed_count"] += 1
                                queue['closed_documents_list'].append(document['doc_id'])
                                close_doc_added = True
                            elif queue_data["queue_id"] == None:
                                if not uncat_close_added:
                                    uncategorized_queue["closed_count"] += 1
                                    uncategorized_queue['closed_documents_list'].append(document['doc_id'])
                                    uncat_close_added = True
            if not added:
                if document['root_id'] == document['doc_id']:
                    document_updated = update_document_info(document)
                else:
                    if document['root_id'] not in uncategorized_queue['root']:
                        root_doc = get_root_documents(document['root_id'], documents_list)
                        uncategorized_queue['root'][document['root_id']] = root_doc
                    else:
                        root_doc = uncategorized_queue['root'][document['root_id']]
                    document_updated = update_document_info(root_doc)
                if document_updated not in uncategorized_queue['documents_list']:
                    uncategorized_queue["documents_list"].append(document_updated)
        except Exception as e:
            print(str(e))
    queues_list.append(uncategorized_queue)
    return queues_list


def update_document_info(document):
    doc_state = document["doc_state"]
    status = "New"
    assignee = None
    is_assigned = False
    if "life_cycle" in document and doc_state in document["life_cycle"]:
        data = document["life_cycle"][doc_state]
        if isinstance(data, dict):
            status = data.get("status", None)
            assignee = data.get("assignee", None)
            is_assigned = data.get("is_assigned", None)
    temp_doc = {'doc_id': document['doc_id'],
                'status': status,
                'assignee': assignee,
                'created_ts':document['created_ts'],
                'file_name': document['metadata']['properties']['filename'],
                'extn': document['metadata']['properties']['extension'],
                'child_documents': document['children'],
                'doc_state': document['doc_state'],
                'is_assigned': is_assigned}
    if 'template_info' in document['metadata']:
        temp_doc.update({'template_id': document['metadata']['template_info']['id'],
                         'template_name': document['metadata']['template_info']['name']})
    return temp_doc


def get_all_documents(solution_id):
    query = {"solution_id": solution_id,"is_template":False,
             "$or": [{"is_test": False}, {"is_test": {"$exists": False}}]}
    projection = {"doc_id": 1, "solution_id": 1, "metadata": 1,
                  "life_cycle": 1, "doc_state": 1, "children": 1,
                  "created_ts": 1, "page_groups": 1,
                  '_id': 0, 'root_id': 1}
    documents = MongoDbConn.find(DOCUMENTS_COLLECTION, query,
                                 projection=projection).sort('_id', -1).limit(1000)
    return documents


def get_all_queues_name(solution_id):
    query = {'is_deleted': False, "solution_id": solution_id}
    queues = MongoDbConn.find(CASE_QUEUE_COLLECTION, query).sort('modified_ts', -1)
    queues_list = []
    for queue in queues:
        if isinstance(queue["processing_state"], list):
            queue_dict = dict(queue_id=queue['queue_id'], queue_name=queue['queue_name'])
            queues_list.append(queue_dict)
    return queues_list


def get_root_documents(doc_id, documents_list):
    try:
        for doc in documents_list:
            if doc['doc_id'] == doc_id:
                return doc
    except Exception as e:
        return None


def get_dashboard_docs(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        queues_name = get_all_queues_name(solution_id)
        if request.method == "POST":
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            if payload["queue_id"] != "uncategorized":
                queue_id = int(payload["queue_id"])
            else:
                queue_id = payload["queue_id"]
            searched_text = None
            if 'searched_text' in payload:
                searched_text = payload['searched_text']
            role = payload["role"]
            documents = get_all_documents(solution_id)
            documents = [document for document in documents]
            if searched_text and searched_text.strip() != '':
                documents = get_filtered_docs(documents, searched_text.lower())
            # documents = get_all_documents(solution_id, searched_text)
            sort_by, order_by_asc, skip, limit = get_pagination_details(payload["filter_obj"], sort_by='created_ts',
                                                                        order_by_asc=-1,
                                                                        skip=0, limit=0)
            # filter_obj = {"page_no":1,"no_of_recs":8,"sort_by":"created_ts","order_by":False}
            # sort_by, order_by_asc, skip, limit = get_pagination_details(filter_obj, sort_by='created_ts',
            #                                                             order_by_asc=-1,
            #                                                             skip=0, limit=0)
            order = True if order_by_asc == -1 else False
            queues_list = get_all_queues_documents(solution_id,documents)
            queue_info = next((queue for queue in queues_list if queue["queue_id"] == queue_id), None)
            if role == "bu":
                documents_list_tmp = [document for document in queue_info["documents_list"] if document["assignee"] == None or
                                  document["assignee"] == payload["user_name"]]
            else:
                documents_list_tmp = queue_info["documents_list"]
            if searched_text and searched_text.strip() != '':
                documents_list = []
                for doc in documents_list_tmp:
                    added = False
                    if doc['status'] and searched_text in doc['status']:
                        documents_list.append(doc)
                        added = True
                    if not added and doc['assignee'] and \
                            searched_text in doc['assignee']:
                        documents_list.append(doc)
                        added = True
                    if not added and searched_text == 'assign':
                        if doc['assignee'] == None or not doc['assignee']:
                            documents_list.append(doc)
                            added = True
                    if not added:
                        documents_list.append(doc)
            else:
                documents_list = documents_list_tmp
            total_documents = len(documents_list)
            documents_list = sorted(documents_list, key=lambda f: f[sort_by],reverse=order)
            if total_documents > limit:
                documents_list = documents_list[skip:skip + limit]
            if queue_id == "uncategorized":
                # agents = get_solution_agents(solution_id,"bu")
                # qdm_obj = QueueDocMapper()
                agents = get_all_agents(solution_id, context, user_role="bu")
                processing_state = []
            else:
                agents = queue_info["agents"]
                processing_state = queue_info["processing_state"]
            return {"status":"success","documents":documents_list,"agents":agents,
                    "state":processing_state, 'total_documents': total_documents, 'queue_name': queues_name}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Error while retrieving the document details information", "error": str(e)}
    finally:
        context.end_span()


def get_all_agents(solution_id, context, user_role=None):
    """
    This function will fetch all the user for a given solution Id
    and return the list of users as response
    :param solution_id: Session Solution ID
    :param context: Logger object
    :param user_role: Logged In user role
    :return: List of users as response
    """
    try:
        agents = list()
        us_obj = UserServices()
        user_details = us_obj.get_users_list()
        if user_details and user_details['status_code'] == 200:
            if 'result' in user_details \
                    and 'data' in user_details['result']:
                users_data = user_details['result']['data']
                for user_data in users_data:
                    user_mapped = False
                    added = False
                    if 'solutions' in user_data:
                        solns = user_data['solutions']
                        for soln in solns:
                            if 'id' in soln \
                                    and soln['id'] == solution_id:
                                user_mapped = True
                                break
                        if user_role and user_mapped:
                            user_roles = user_data['userRoles']
                            for role in user_roles:
                                if 'name' in role \
                                        and role['name'] == user_role:
                                    agents.append(user_data['userName'])
                                    added = True
                                    break
                    if user_mapped and not added:
                        agents.append(user_data['userName'])
        return agents
    except Exception as e:
        context.log(message=str(e),
                    obj={'tb': traceback.format_exc()})
        return list()


def get_filtered_docs(documents, searched_text):
    filtered_docs = []
    for doc in documents:
        found_flag = False
        if searched_text in doc['doc_id'].lower():
            filtered_docs.append(doc)
            found_flag = True
        if not found_flag and 'metadata' in doc and 'properties' in doc['metadata']:
            if searched_text in doc['metadata']['properties']['filename'].lower():
                filtered_docs.append(doc)
                found_flag = True
        if not found_flag and 'life_cycle' in doc:
            life_cycle_state_docs = doc['life_cycle']
            for lc_doc in life_cycle_state_docs:
                if 'status' in life_cycle_state_docs[lc_doc]:
                    if life_cycle_state_docs[lc_doc]['status'] and \
                            searched_text in life_cycle_state_docs[lc_doc]['status'].lower():
                        filtered_docs.append(doc)
                        found_flag = True
                        break
        if not found_flag and 'life_cycle' in doc:
            life_cycle_state_docs = doc['life_cycle']
            for lc_doc in life_cycle_state_docs:
                if 'assignee' in life_cycle_state_docs[lc_doc]:
                    if life_cycle_state_docs[lc_doc]['assignee'] and \
                            searched_text in life_cycle_state_docs[lc_doc]['assignee'].lower():
                        filtered_docs.append(doc)
                        found_flag = True
                        break
                    else:
                        if searched_text == 'assign':
                            if not life_cycle_state_docs[lc_doc]['assignee'] or \
                                    life_cycle_state_docs[lc_doc]['assignee'] is None:
                                filtered_docs.append(doc)
                                found_flag = True
                                break
        if not found_flag and 'metadata' in doc and 'template_info' in doc['metadata']:
            if searched_text in doc['metadata']['template_info']['name'].lower():
                found_flag = True
                filtered_docs.append(doc)
        if not found_flag and 'page_groups' in doc:
            doc_groups = doc["page_groups"]
            for doc_grp in doc_groups:
                if 'template_name' in doc_grp:
                    if searched_text in doc_grp['template_name'].lower():
                        filtered_docs.append(doc)
                        found_flag = True
                        break
        if not found_flag and searched_text in doc['doc_state'].lower():
            filtered_docs.append(doc)
    return filtered_docs


def update_case_status(doc_id, doc_state):
    """
    :param doc_id: document ID
    :param doc_state: document state
    :return: status boolean flag
    """
    context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="ERROR")
    context.start_span(component=__name__)
    try:
        query = {'doc_id': doc_id}
        projection = {'_id': 0, 'life_cycle': 1, 'doc_state': 1}
        doc = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query, projection=projection)
        if doc:
            if doc_state != doc['doc_state']:
                return False
            if doc['doc_state'] == "classified":
                doc.update({'feedback': {}, 'entity_feedback': None})
            if doc['doc_state'] == 'extracted':
                doc.update({'entity_feedback': None})
            temp_dict = {'is_assigned': False,
                         'assignee': None,
                         'assigned_ts': None,
                         'closed_ts': None,
                         'status': 'New',
                         'queue_id': None,
                         'queue_name': None}
            doc_states = doc_state_changes_dict[doc_state]
            for d_state in doc_states:
                if d_state in doc['life_cycle']:
                    doc['life_cycle'][d_state] = temp_dict
            doc['updated_ts'] = datetime.now()
            query = {'doc_id': doc_id}
            MongoDbConn.update(DOCUMENTS_COLLECTION, query, doc)
            return True
        return False
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return False
    finally:
        context.end_span()


def case_management_dashboard_service(request):
    """
    This function will accept the Http request from UI
    and forward it to case management service
    :param request: Http Request
    :return: response received from case management service
    """
    context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="ERROR")
    context.start_span(component=__name__)
    try:
        full_path = request.get_full_path()
        path = '/'.join(full_path.split('/')[2:])
        method = request.method
        headers = {'authorization': request.META['HTTP_AUTHORIZATION']}
        payload = {}
        if method in ['POST']:
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
        url = CASE_MANAGEMENT_SERVICE_URL + path
        if method == 'POST':
            resp = requests.post(url, data=json.dumps(payload), headers=headers)
            return json.loads(resp.text)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': {'success': False,
                           'msg': 'Failed to process dashboard request.',
                           'code': 500}
                }
    finally:
        context.end_span()
        
        
def fetch_agents(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        if request.method != 'POST':
            return {'status': {'success': False, 'msg': 'Only POST request will be handled.',
                               'code': 400}, 'metadata': {}}
        try:
            payload = json.loads(request.body.decode())
        except:
            payload = request.POST
        solution_id = payload['solution_id']
        roles = payload['data']['roles']
        user_group_ids = payload['data']['user_groups']
        queue_id = payload['data']['queue_id']
        if queue_id.lower() == 'uncategorized':
            ug_members = get_all_users(request)
        else:
            ug_members = get_user_groups(user_group_ids, request)
        return collect_agents(ug_members, solution_id, roles)
    except Exception as e:
        context.log(message={"msg": 'Error while processing get matched agents. ' + str(e)},
                    obj={"tb": traceback.format_exc()})
        raise e
    finally:
        context.end_span()


def get_all_users(request):
    ug_members = list()
    headers = {'Content-Type': 'application/json',
               'Accept': '*/*',
               'authorization': "Bearer " + request.META['HTTP_AUTHORIZATION']}
    resp = requests.get(KEY_CLOAK_API_URI + 'groups/', headers=headers)
    if resp:
        try:
            response = json.loads(resp.text)
        except:
            return []
        if int(response['statusCode']) == 200:
            data = response['data']
            for group in data:
                if 'members' in group:
                    ug_members.extend(group['members'])
                if 'subGroups' in group and group['subGroups'] is not None and len(group['subGroups']) > 0:
                    ug_members.extend(get_subgroups_members(group['subGroups'], ug_members))
    return ug_members


def collect_agents(ug_members, solution_id, roles):
    agents_list = list()
    for ug_member in ug_members:
        if 'solutions' in ug_member and ug_member['solutions'] is not None and len(ug_member['solutions']) > 0:
            for soln in ug_member['solutions']:
                if soln['id'] == solution_id:
                    if 'userRoles' in ug_member and ug_member['userRoles'] is not None and len(ug_member['userRoles']) > 0:
                        for role in ug_member['userRoles']:
                            if role['name'].lower() in roles:
                                user_dict = {'id': ug_member['id'],
                                             'name': ug_member['userName']}
                                if user_dict not in agents_list:
                                    agents_list.append(user_dict)
                                    break
                    break
    return {'status': {'success': True, 'msg': 'Fetched agents list.',
                       'code': 200}, 'metadata': {'agents': agents_list}}


def get_user_groups(ug_list, request):
    ug_members = list()
    headers = {'Content-Type': 'application/json',
               'Accept': '*/*',
               'authorization': "Bearer " + request.META['HTTP_AUTHORIZATION']}
    for ug in ug_list:
        resp = requests.get(KEY_CLOAK_API_URI+'groups/'+ug, headers=headers)
        if resp:
            try:
                response = json.loads(resp.text)
            except:
                continue
            if int(response['statusCode']) == 200:
                data = response['data']
                if 'members' in data:
                    ug_members.extend(data['members'])
                if 'subGroups' in data and data['subGroups'] is not None and len(data['subGroups']) > 0:
                    ug_members.extend(get_subgroups_members(data['subGroups'], ug_members))
    return ug_members


def get_subgroups_members(subgroups, ug_members):
    for subg in subgroups:
        if 'subGroups' in subg and subg['subGroups'] is not None and len(subg['subGroups']) > 0:
            ug_members.extend(get_subgroups_members(subg['subGroups'], ug_members))
        ug_members.extend(subg['members'])
    return ug_members
