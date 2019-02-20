"""
@author: Rohit Kumar Jaju
@date: June 21, 2018
@purpose: The functions mentioned in this python file are responsible
          for all kind of Case Queue Management related CRUD operations.
          All functions are exposed as APIs.
"""
import json, requests
from uuid import uuid4
from datetime import datetime
from connections.mongodb import MongoDbConn
from utilities.common import get_solution_from_session, create_data,\
    save_file_fetched_from_efs
from config_vars import SERVICE_NAME, CASE_QUEUE_COLLECTION,\
    DOCUMENTS_COLLECTION, ENTITY_CONFIG, WORKFLOW_QUEUE_COLLECTION,\
    STATUS_CODES, WORKFLOW_COLLECTION, CASE_MANAGEMENT_SERVICE_URL
from xpms_common import trace
import traceback
from random import randint
#from api.models import Solution, SolutionUser
from services.dashboard import update_document_info
from services.entity import entity_download, config_from_endpoint
from services.models import implement_pagination
from services.rules import update_rule, get_rule
from services.solutions import SolutionService
from services.user_services import UserServices
from services.template import get_template

us_obj = UserServices()
tracer = trace.Tracer.get_instance(SERVICE_NAME)

display_to_d_state = {'Needs Classification': 'classified',
                      'Post Processing': 'post_processed',
                      'Processing': 'processing',
                      'Reviewed': 'reviewed',
                      'Extraction': 'extracted',
                      'Annotation & Entity Linking': 'processed',
                      'Error': 'failed'}


def case_assignment_service(request, sv_user=None, queue_id=None,
                            status='All'):
    """
    This function is providing the functionalities related to
    case assignment/re-assignment of case/cases and update the
    document life cycle
    :param request: request to be processed
    :param sv_user: supervisor user
    :param queue_id: requested queue_id
    :param status: case status for which data is requested
    :return: Json Response
    """
    context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == 'GET':
            if queue_id:
                return fetch_queue_cases(queue_id, status, context)
            else:
                return fetch_all_queues_cases_data(sv_user, context)
        if request.method == 'POST':
            case_assign_request = json.loads(request.body.decode())
            results = []
            for item in case_assign_request:
                if 'status_change' in item:
                    results.append(process_update_case_status(item, solution_id, context))
                else:
                    results.append(process_case_assignment_task(item, solution_id, context))

            # check if all the assignments are successful
            final_result = any(result.get('status') == "failure" for result in results)

            if final_result:
                return {'status': 'failure', 'msg': 'Failed to assign case.'}
            else:
                return {'status': 'success', 'msg': 'Case(s) have been updated successfully.'}

    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occured.'
                                            'Request can not be processed.'}
    finally:
        context.end_span()


def fetch_queue_cases(queue_id, status, context):
    """
    This function will return all cases data related to provided queue id
    :param queue_id: requested queue_id
    :param status: status of the case
    :param context: logger object
    :return:
    """
    try:
        temp_list, soln_list, queue_list = fetch_temp_soln_id_from_case_queue\
            (context, queue_id=queue_id)
        queue_name = None
        if queue_list and len(queue_list) > 0:
            queue_name = queue_list[0]
        doc_records = get_document_record_list(temp_list, soln_list, queue_name,
                                               context)
        data_list = []
        agent_list = fetch_agent_list(queue_id, context)
        if doc_records:
            for doc_record in doc_records:
                if 'life_cycle' in doc_record:
                    doc_id = doc_record['doc_id']
                    filename = ''
                    if 'metadata' in doc_record:
                        if 'file_name' in doc_record['metadata']:
                            filename = doc_record['metadata']['file_name']
                    life_cycle_dict = doc_record['life_cycle']
                    if queue_name in life_cycle_dict:
                        queue_dict = life_cycle_dict[queue_name]
                        if status != 'All':
                            if queue_dict['status'] != status:
                                continue
                        temp_dict = dict()
                        temp_dict.update({'case_id': doc_id,
                                          'filename': filename,
                                          'status': queue_dict['status'],
                                          'assignee': queue_dict['assignee']})
                        data_list.append(temp_dict)
        return {'status': 'success', 'msg': 'Data fetched successfully.',
                'data': data_list, 'agents': agent_list}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occured.'
                                            'Request can not be processed.'}


def fetch_agent_list(queue_id, context):
    """
    This function will fetch all the agents
    which are associated with the queue
    :param queue_id: queue_id
    :param context: logger object
    :return: agent_list
    """
    try:
        query = {'queue_id': int(queue_id)}
        projection = {'agents': 1, '_id': 0}
        agents_cur = MongoDbConn.find_one(CASE_QUEUE_COLLECTION, query,
                                      projection=projection)
        if agents_cur:
            return agents_cur['agents']
        return []
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def get_document_record_list(temp_list, soln_list, doc_state,
                             context):
    """
    This function will return the list of records from console_document
    collection
    :param temp_list:
    :param soln_list:
    :param queue_name:
    :param context:
    :return:
    """
    try:
        query = {'solution_id': {'$in': soln_list},
                 'template_id': {"$in": temp_list},
                 'doc_state': doc_state}
        projection = {'_id': 0}
        doc_records = MongoDbConn.find(DOCUMENTS_COLLECTION,
                                          query,
                                          projection=projection)
        return doc_records
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def process_update_case_status(payload, solution_id, context):
    """
    This function will update the case status in document life
    cycle in console_document collection and return the json response
    :param payload: requested payload
    :param solution_id: session solution_id
    :param context: logger object
    :return: Json response
    """
    try:
        valid_flag = validate_payload(payload)
        if not valid_flag:
            return {'status': 'failure', 'msg': 'Payload validation failed.'}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occured.'
                                            'Request can not be processed.'}


def validate_payload(payload):
    """
    This function will validate the requested payload
    and return the boolean response
    :param payload: requested payload
    :return: validation flag
    """
    if 'status' not in payload:
        return False
    if 'doc_state' not in payload:
        return False
    if 'queue_id' not in payload:
        return False
    if 'case_id' not in payload:
        return False
    return True


def fetch_temp_soln_id_from_case_queue(context, sv_user=None,
                                       queue_id=None):
    """
    This function will fetch the templates id from case queue collection
    and return list of templates id and solution id
    :param context: Logger Object
    :param sv_user: supervisor user
    :param queue_id: queue_id
    :return: list of all template id and solution id
    from case queue collection
    """
    try:
        query = {}
        projection = {'_id': 0, 'document_type': 1, 'solution_id': 1,
                      'queue_name': 1}
        if sv_user:
            query.update({'supervisor': sv_user})
        if queue_id:
            query.update({'queue_id': int(queue_id)})
        temp_records = MongoDbConn.find(CASE_QUEUE_COLLECTION, query,
                                        projection=projection)
        if temp_records:
            temp_list = []
            soln_list = []
            queue_name = []
            for item in temp_records:
                for ele in item['document_type']:
                    temp_list.append(ele)
                soln_list.extend(item['solution_id'])
                queue_name.append(item['queue_name'])
            return temp_list, soln_list, queue_name
        else:
            return [], [], []
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return [], [], []


def fetch_all_queues_cases_data(sv_user, context):
    """
    This function will fetch all the documents from console_document collection
    and return the fetched data
    :param sv_user: supervisor user
    :param context: Logger object
    :return:
    """
    try:
        temp_list, soln_list, queue_list = fetch_temp_soln_id_from_case_queue(context,
                                                                  sv_user=sv_user)
        return fetch_doc_life_cycle(soln_list, temp_list, queue_list, context)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occured.'
                                            'Request can not be processed.'}


def process_db_data(docs_data, queue_list, context):
    """
    This function will process fetched console_document db data
    and return the required output
    :param docs_data: console_document db data
    :param queue_list: list of queue name
    :param context: logger object
    :return: Json response
    """
    try:
        new_case_count, in_progress_case_count = 0, 0
        closed_case_count, unassigned_case_count = 0, 0
        queue_dict = dict()
        for q_name in queue_list:
            queue_dict[q_name] = dict()
            for item in docs_data:
                if 'life_cycle' in item:
                    doc_state_dict = item['life_cycle']
                    if q_name not in doc_state_dict:
                        continue
                    for out_ele in doc_state_dict:
                        ele = doc_state_dict[out_ele]
                        if not ele['queue_id']:
                            continue
                        queue_dict, unassigned_case_count, new_case_count, \
                        in_progress_case_count, closed_case_count = \
                            update_cases_counters(queue_dict, q_name, ele,
                                                  unassigned_case_count,
                                                  new_case_count,
                                                  in_progress_case_count,
                                                  closed_case_count)
                else:
                    queue_dict = post_data_in_queue(q_name, queue_dict,
                                                    item, context)
            queue_dict['new_case_count'] = new_case_count
            queue_dict['in_progress_case_count'] = in_progress_case_count
            queue_dict['closed_case_count'] = closed_case_count
            queue_dict['unassigned_case_count'] = unassigned_case_count
        return {'status': 'success', 'msg': 'Data fetched successfully.',
                'data': queue_dict}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Unable to fetch data.'}


def update_cases_counters(queue_dict, doc_state, ele,
                          unassigned_case_count, new_case_count,
                          in_progress_case_count, closed_case_count):
    """
    This function will update the counters for different case status
    and return the updated counters
    :param queue_dict: queue dictionary
    :param doc_state: current document state
    :param ele: iterator object
    :return: updated queue_dict and other counters
    """
    if not ele['is_assigned']:
        queue_dict = update_count(doc_state, queue_dict,
                                  'unassigned_case_count')
        unassigned_case_count += 1
    elif ele['is_assigned'] and ele['status'] == 'New':
        queue_dict = update_count(doc_state, queue_dict,
                                  'new_case_count')
        new_case_count += 1
    elif ele['is_assigned'] and ele['status'] == 'In Progress':
        queue_dict = update_count(doc_state, queue_dict,
                                  'in_progress_case_count')
        in_progress_case_count += 1
    elif ele['is_assigned'] and ele['status'] == 'Closed':
        queue_dict = update_count(doc_state, queue_dict,
                                  'closed_case_count')
        closed_case_count += 1
    queue_dict[doc_state]['queue_id'] = ele['queue_id']
    return queue_dict, unassigned_case_count, new_case_count,\
           in_progress_case_count, closed_case_count


def update_count(doc_state, queue_dict, key):
    """
    This function will update the cases count in the response dictionary
    and return the response dictionary
    :param doc_state: current state of the document
    :param queue_dict: response dictionary
    :param key: key
    :return: updated response dictionary
    """
    if key in queue_dict[doc_state]:
        queue_dict[doc_state][key] += 1
    else:
        queue_dict[doc_state][key] = 1
    return queue_dict


def post_data_in_queue(doc_state, queue_dict,
                       data, context):
    """
    This function will put default data in document life cycle for a
    document based on its current document state
    :param doc_state: current state of the document
    :param queue_dict: response dictionary
    :param data: console_document record
    :param context: logger object
    :return: updated response dictionary
    """
    try:
        data = prepare_doc_life_cycle_data(doc_state, data, context)
        update_db_record(data, context, doc_state)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    return queue_dict


def update_db_record(data, context, doc_state):
    """
    This function will update the document life cycle data
    in console_document collection
    :param data: db_record data
    :param context: logger object
    :param doc_state: current document state
    :return:
    """
    try:
        solution_id = data['solution_id']
        doc_id = data['doc_id']
        query = {'solution_id': solution_id, 'doc_id': doc_id}
        MongoDbConn.update(DOCUMENTS_COLLECTION, query, data)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def fetch_doc_life_cycle(soln_list, temp_list, queue_list, context):
    """
    This function will fetch all the console_document data based on
    solution_id and template id and return the json response
    :param soln_list: session solution id
    :param temp_list: list of templates available in
    case queue collection
    :param queue_list: list of queues name
    :param context: Logger Object
    :return: Json response
    """
    try:
        query = {'solution_id': {'$in': soln_list},
                 'template_id': {"$in": temp_list}}
        projection = {'_id': 0}
        docs_data = MongoDbConn.find(DOCUMENTS_COLLECTION, query,
                                     projection=projection)
        if docs_data:
            return process_db_data(docs_data, queue_list, context)
        else:
            return {'status': 'success', 'msg': 'No data is available.',
                    'data': {}}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occured.'
                                            'Request can not be processed.'}


def validate_case_assignment_payload(payload):
    """
    This function will validate the request payload
    and return the json response and validation flag
    :param payload: Payload to be validated
    :return: json response and validation flag
    """
    if 'file_name' not in payload:
        return {'status': 'failure', 'msg': 'filename is not provided.'},\
               False
    if 'doc_state' not in payload:
        return {'status': 'failure', 'msg': 'document state is not provided.'},\
               False
    if 'doc_id' not in payload:
        return {'status': 'failure', 'msg': 'Case Id is not provided.'},\
               False
    if 'queue_id' not in payload and 'assignee' not in payload:
        return {'status': 'failure',
                'msg': 'Please provide either queue_id or assignee name.'},\
               False
    if 'status' not in payload:
        return {'status': 'failure', 'msg': 'Document status '
                                            'is not provided.'}, False
    return None, True


def get_document_record(doc_id, context):
    """
    This function will access the console_document collection in Mongodb
    and return the required record from db
    :param doc_id: document Id which is get processed
    :param context: Logger Object
    :return: console_document collection record
    """
    try:
        query = {'doc_id': doc_id}
        projection = {'_id': 0}
        doc_record = MongoDbConn.find_one(DOCUMENTS_COLLECTION,
                                          query,
                                          projection=projection)
        return doc_record
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def update_doc_life_cycle(doc_life_cycle, queue_id, queue_name,
                          assignee, status, processing_state):
    """
    This function will update the document life cycle data
    and returned the update life cycle dictionary
    :param doc_life_cycle: document life cycle dictionary
    :param queue_id: queue id
    :param queue_name: queue name
    :param assignee: current assignee for this case
    :param status: case status
    :param processing_state: processing_state
    :return: updated document life cycle dictionary
    """
    if queue_id is not None and queue_id != 'uncategorized':
        queue_id = int(queue_id)
    if status.lower() == 'closed':
        closed_ts = datetime.now()
    else:
        closed_ts = None
    doc_life_cycle_state = dict()
    if processing_state in doc_life_cycle:
        doc_life_cycle_state = doc_life_cycle[processing_state]
        if not isinstance(doc_life_cycle_state, dict):
            return doc_life_cycle
    doc_life_cycle_state.update({'is_assigned': True,
                                 'assignee': assignee,
                                 'status': status,
                                 'queue_id': queue_id,
                                 'queue_name': queue_name,
                                 'assigned_ts': datetime.now(),
                                 'closed_ts': closed_ts})
    doc_life_cycle[processing_state] = doc_life_cycle_state
    return doc_life_cycle


def update_doc_life_cycle_data(doc_record, updated_doc_life_cycle, context):
    """
    This function will update the console_document collection life_cycle data
    :param doc_record: console_document record
    :param updated_doc_life_cycle: updated document life cycle dictionary
    :param context: Logger Object
    :return: Json Response
    """
    try:
        doc_id = doc_record['doc_id']
        doc_record.update({'life_cycle': updated_doc_life_cycle,
                           'updated_ts': datetime.now()})
        query = {'doc_id': doc_id}
        MongoDbConn.update(DOCUMENTS_COLLECTION, query, doc_record)
        return {'status': 'success', 'msg': 'Case assigned successfully.'}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to assign case.'}


def get_queue_name(queue_id, context, queue_name=True):
    """
    This method will fetch the queue name based on the queue_id
    :param queue_id: Queue unique identifier
    :param context: Logger object
    :return: queue name
    """
    try:
        query = {'queue_id': queue_id}
        if queue_name:
            projection = {'queue_name': 1, '_id': 0}
            return MongoDbConn.find_one(CASE_QUEUE_COLLECTION,
                                    query,
                                    projection=projection)['queue_name']
        else:
            projection = {'_id': 0}
            return MongoDbConn.find_one(CASE_QUEUE_COLLECTION,
                                        query,
                                        projection=projection)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def get_all_child_docs(parent_doc, context):
    """
    This function will fetch all the child documents for a given parent_document
    and return the list of child documents
    :param parent_doc: Parent document
    :param context: logger object
    :return: list of child documents
    """
    try:
        child_doc_list = parent_doc['children']
        query = {'doc_id': {'$in': child_doc_list}}
        projection = {'_id': 0}
        child_docs = MongoDbConn.find(DOCUMENTS_COLLECTION, query,
                                      projection=projection)
        if child_docs:
            return [child_doc for child_doc in child_docs]
        else:
            return []
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def process_case_assignment_task(payload, solution_id, context):
    """
    This function will process the case assignment request
    and return the json response
    :param payload: request payload
    :param solution_id: Session Solution Id
    :param context: Logger Object
    :return: Json response
    """
    try:
        validation_json, valid_flag = \
            validate_case_assignment_payload(payload)
        if not valid_flag:
            return validation_json
        doc_id = payload['doc_id']
        queue_id = None
        queue_name = None
        assignee = None
        queue_recs = list()
        if 'queue_id' in payload:
            queue_id = payload['queue_id']
            if queue_id != 'uncategorized':
                queue_recs = get_queue_name(int(queue_id), context, False)
                if queue_recs and 'queue_name' in queue_recs:
                    queue_name = queue_recs['queue_name']
            else:
                queue_name = 'uncategorized'
                # queue_id = None
                query = {'solution_id': solution_id, 'is_deleted': False}
                projection = {'_id': 0}
                queues = MongoDbConn.find(CASE_QUEUE_COLLECTION, query,
                                         projection=projection)
                queue_recs = [queue for queue in queues]
        if 'assignee' in payload:
            assignee = payload['assignee']
        if not assignee or assignee is None or assignee.strip() == '':
            assignee = None
        doc_rec = get_document_record(doc_id, context)
        if doc_rec:
            if doc_rec['root_id'] == doc_id:
                doc_records = get_all_child_docs(doc_rec, context)
                doc_records.append(doc_rec)
            else:
                doc_records = [doc_rec]
            if queue_id != 'uncategorized':
                queue_id = int(queue_id)
            if update_assignment(doc_records, payload, queue_id, queue_name,
                                 assignee, context, queue_recs):
                return {'status': 'success', 'msg': 'Case assigned successfully.'}
            else:
                return {'status': 'failure', 'msg': 'Failed to assign case.'}
        return {'status': 'failure', 'msg': 'Failed to assign case.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to assign case.'}


def get_group_templates(doc_record,  context):
    """
    This function will prepare the template group
    for a given document record
    :param doc_record: Document record
    :param context: Logger object
    :return:
    """
    try:
        group_templates = []
        if "template_id" not in doc_record and "groups" in doc_record:
            if isinstance(doc_record["groups"], dict) and "groups" in doc_record["groups"]:
                for group in doc_record["groups"]["groups"]:
                    if "template_id" in group:
                        group_templates.append(group["template_id"])
        return group_templates
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return list()


def update_assignment(doc_records, payload, queue_id, queue_name,
                      assignee, context, queue_recs):
    """
    This function will assign the cases to the agents
    and return the status dictionary
    :param doc_records: list of documents
    :param payload: request payload
    :param queue_id: queue id
    :param queue_name: queue name
    :param assignee: agent name
    :param context: logger object
    :param queue_recs: particular queue record
    :return: status dictionary
    """
    try:
        if len(doc_records) > 1:
            child_doc_records = doc_records[:-1]
            for doc_record in child_doc_records:
                group_templates = get_group_templates(doc_record, context)
                if not doc_highlighter(doc_record, group_templates,
                                       queue_id, queue_recs):
                    continue
                if queue_id == 'uncategorized':
                    queue_id_temp = None
                else:
                    queue_id_temp = queue_id
                updated_doc_life_cycle = update_life_cycle(doc_record, queue_id_temp,
                                                           queue_name, assignee,
                                                           payload, context)
                resp = update_doc_life_cycle_data(doc_record, updated_doc_life_cycle,
                                                  context)
                if resp['status'] == 'failure':
                    return False
        if queue_id == 'uncategorized':
            queue_id_temp = None
        else:
            queue_id_temp = queue_id
        updated_doc_life_cycle = update_life_cycle(doc_records[-1], queue_id_temp,
                                                   queue_name, assignee,
                                                   payload, context)
        resp = update_doc_life_cycle_data(doc_records[-1], updated_doc_life_cycle,
                                          context)
        if resp['status'] == 'failure':
            return False
        return True
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return False


def doc_highlighter(document, group_templates, parent_queue_id, queue):
    if parent_queue_id == 'uncategorized':
        queue_found = False
        for q in queue:
            if document_queue_comparision(document, q, group_templates):
                queue_found = True
                break
        if not queue_found:
            return True
        return False
    else:
        if document_queue_comparision(document, queue, group_templates):
            return True
        else:
            return False


def update_life_cycle(doc_record, queue_id, queue_name, assignee,
                      payload, context):
    """
    This function will process the doc_record and update the doc life cycle
    and return the updated doc life cycle dictionary
    :param doc_record: Document record
    :param queue_id: Queue Id
    :param queue_name: Queue Name
    :param assignee: Assignee
    :param payload: request payload
    :param context: Logger object
    :return: updated doc life cycle dictionary
    """
    try:
        doc_life_cycle, metadata = None, None
        if 'life_cycle' in doc_record:
            doc_life_cycle = doc_record['life_cycle']
        if not doc_life_cycle:
            doc_record.update({'life_cycle': {}})
            doc_life_cycle = doc_record['life_cycle']
        updated_doc_life_cycle = update_doc_life_cycle(doc_life_cycle,
                                                       queue_id,
                                                       queue_name,
                                                       assignee,
                                                       payload['status'],
                                                       payload['doc_state'])
        return updated_doc_life_cycle
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def case_queue_services(request, queue_id=None):
    """
    This function is providing the functionalities to create new case queue,
    delete any existing queue(conditions applied), get all existing case queues
    with all relevent data
    :param request: request to be processed
    :param queue_id: queue to be deleted
    :return: Json Response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        # solution_id = get_solution_from_session(request)
        # GET all case queues related data
        if request.method == 'GET':
            return fetch_case_queue_data(request, context)
        # Create new case queue
        elif request.method == 'POST':
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            queue_name = payload['queue_name']
            if payload:
                return create_case_queue(payload, context,
                                         queue_name)
            else:
                return {'status': 'failure',
                        'msg': 'Failed to create ' + queue_name + ' queue.'}
        # Delete case queue(conditional)
        elif request.method == 'DELETE':
            return delete_queue(context, queue_id)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def delete_queue(context, queue_id):
    """
    This function will mark queue as deleted queue in db
    :param context: Logger object
    :param queue_id: queue to be deleted
    :return: Json response
    """
    if (queue_id is None) or (queue_id == ''):
        return {'status': 'failure', 'msg': 'Failed to remove queue.'}
    return perform_queue_deletion(queue_id, context)


def perform_queue_deletion(queue_id, context):
    """
    This function will actually performing queue deletion operation
    :param queue_id: case queue to be deleted
    :param context: Logger object
    :return: Json response
    """
    try:
        query = {'queue_id': int(queue_id)}
        data_dict = {'is_deleted': True,
                     'modified_ts': datetime.now()}
        MongoDbConn.update(CASE_QUEUE_COLLECTION, query, data_dict)
        return {'status': 'success',
                'msg': 'Queue has been removed successfully.'}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to remove queue.'}


def fetch_all_solutions(context):
    """
    This function returns the all solution_id and solution name
    in the form of list of dictionaries
    :param context: Logger object
    :return: Solution_id and name mapping in the form of list of
    dictionaries
    """
    solns_resp = SolutionService.get_solutions()
    soln_list = []
    soln_name_list = []
    soln_agents_mapping = dict()
    soln_sv_mapping = dict()
    soln_other_mapping = dict()
    if solns_resp['status'] != 'success':
        return soln_list, soln_name_list, soln_agents_mapping, soln_sv_mapping
    solns = solns_resp['data']
    obj = UserServices()
    users_list = obj.get_users_list()
    for s_obj in solns:
        soln_name = s_obj['solution_name']
        soln_id = s_obj['solution_id']
        soln_id_name_dict = dict()
        soln_id_name_dict['solution_id'] = soln_id
        soln_id_name_dict['solution_name'] = soln_name
        if isinstance(users_list,dict) and "result" in users_list.keys():
            if "data" in users_list["result"].keys():
                users_list = users_list["result"]["data"]
        for user in users_list:
            user_name = user['userName']
            soln_found = False
            if 'solutions' in user and user['solutions']:
                for sln in user['solutions']:
                    if sln['id'] == soln_id:
                        soln_found = True
                        break
            if not soln_found:
                continue
            if 'userRoles' in user and user['userRoles']:
                for role in user['userRoles']:
                    if role['name'] == 'bu':
                        if soln_name not in soln_agents_mapping:
                            soln_agents_mapping[soln_name] = []
                        soln_agents_mapping[soln_name].append(user_name)
                    elif role['name'] == 'sv':
                        if soln_name not in soln_sv_mapping:
                            soln_sv_mapping[soln_name] = []
                        soln_sv_mapping[soln_name].append(user_name)
                    else:
                        if soln_name not in soln_other_mapping:
                            soln_other_mapping[soln_name] = []
                        soln_other_mapping[soln_name].append(user_name)
        soln_name_list.append(soln_name)
        soln_list.append(soln_id_name_dict)
    return soln_list, soln_name_list, soln_agents_mapping,\
           soln_sv_mapping, soln_other_mapping


def fetch_case_queue_data(request, context):
    """
    This function will fetch all case queue data from db collection and return
    :param request: request to be processed
    :param context: Logger Object
    :return: Json Response with all fetched case queue data
    """
    try:
        queue_data = fetch_queue_db_data(context)
        solution_id_dict, soln_name_list, soln_agents_mapping, soln_sv_mapping, other_mapping = \
            fetch_all_solutions(context)
        solution_name_temp_dict = prepare_soln_temp_mapping(request,
                                                            solution_id_dict)
        # supervisors = fetch_users_list(context)
        if queue_data:
            data = prepare_returning_data_json(queue_data,
                                               solution_name_temp_dict,
                                               soln_name_list,
                                               soln_sv_mapping, soln_agents_mapping)
            return {"status": "success",
                    "data": data,
                    "msg": "successfully returned case queue data"}
        else:
            return {"status": "failure",
                    "msg": "Failed to fetch data from DB"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Failed to fetch data from DB"}


def fetch_queue_db_data(context):
    """
    This function will fetch the data from case_queue collection
    and return
    :param context: Logger object
    :return: fetch and return the data fetched from db
    """
    try:
        query = {'is_deleted': False}
        projection = {'_id': 0}
        queue_data = MongoDbConn.find(CASE_QUEUE_COLLECTION,
                                      query, projection=projection)
        return queue_data.sort('modified_ts', -1)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def prepare_soln_temp_mapping(request, solution_id_dict):
    """
    This function will map all solutions with its corresponding templates
    :param request: request to be processed
    :param solution_id_dict: mapping of solution_id and solution_name
    :return: mapping of solution with templates
    """
    solution_name_temp_dict = dict()
    for soln_id in solution_id_dict:
        temp_soln_id = soln_id['solution_id']
        temp_dict = get_template(solution_id=temp_soln_id,
                                  template_type='allpublished')
        if temp_dict['status'] == 'success':
            temp_list = [dict(template_id=temp["template_id"], template_name=temp["template_name"]) for temp in
                         temp_dict["data"]]
        temp_list.extend([{'template_id': 'unknown',
                           'template_name': 'unknown'}])
        for item in temp_list:
            item.update({'solution_id': soln_id['solution_id']})
        solution_name_temp_dict[soln_id['solution_name']] = temp_list
    return solution_name_temp_dict


def prepare_returning_data_json(queue_data, solution_name_temp_dict,
                                soln_name_list, soln_sv_mapping, agents):
    """
    This function prepares the returning data json
    :param queue_data: DB data for all existing queues
    :param solution_name_temp_dict: dictionary consists of
           solution and templates mapping
    :param soln_name_list: list of all solutions
    :param supervisors: list of all active supervisors
    :param agents: list of all active agents/bu_users
    :return: data dictionary
    """
    data = dict()
    all_queue_data = []
    for item in queue_data:
        all_queue_data.append(item)
    data['all_queues'] = all_queue_data
    data['doc_state'] = display_to_d_state
    data['soln_template_data'] = solution_name_temp_dict
    data['solutions'] = soln_name_list
    data['supervisors'] = soln_sv_mapping
    data['agents'] = agents
    return data


def create_case_queue(payload, context, queue_name):
    """
    This method will process the payload provided and create the new case
    queue if payload passes all required validations
    :param payload: request payload to create new case queue
    :param context: Logger object
    :param queue_name: name of the case queue which needs to be created
    :return: Json Response
    """
    try:
        data_dict = create_data(payload)
        data_dict = update_data_dict(data_dict)
        if 'queue_id' not in payload:
            return insert_queue(data_dict, queue_name,
                                context)
        else:
            queue_id = int(payload['queue_id'])
            return update_queue(data_dict,
                                queue_name, queue_id, context)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to create '
                                            + queue_name + ' queue.'}


def update_queue(data_dict, queue_name, queue_id, context):
    """
    This function will update the case queue in db
    :param data_dict: data to be inserted
    :param queue_name: name of the queue
    :param queue_id: queue to be updated
    :param context: logger object
    :return: Json response
    """
    try:
        data_dict.update({'modified_ts': datetime.now(),
                          'queue_id': queue_id,
                          'is_deleted': False})
        MongoDbConn.update(CASE_QUEUE_COLLECTION,
                           {'queue_id': queue_id},
                           data_dict)
        return {"status": "success", "msg": "Queue " + queue_name +
                                            " updated Successfully."}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to update '
                                            + queue_name + ' queue.'}


def insert_queue(data_dict, queue_name, context):
    """
    This function will create a new case queue in db
    :param data_dict: data to be inserted
    :param queue_name: name of the queue
    :param context: Logger object
    :return: Json response
    """
    try:
        queue_id = randint(100000, 999999)
        while not request_data_validation(queue_id):
            queue_id = randint(100000, 999999)
        data_dict.update({'created_ts': datetime.now(),
                          'modified_ts': datetime.now(),
                          'queue_id': queue_id,
                          'is_deleted': False})
        MongoDbConn.insert(CASE_QUEUE_COLLECTION, data_dict)
        return {"status": "success", "msg": "Queue " + queue_name +
                                            " created Successfully."}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Failed to create '
                                            + queue_name + ' queue.'}


def update_data_dict(data_dict):
    """
    This function will update the data_dict for some fields
    :param data_dict:
    :return: updated data_dict
    """
    if 'agents' in data_dict:
        if type(data_dict['agents']) == str:
            data_dict['agents'] = data_dict['agents'].split(',')
    else:
        data_dict['agents'] = []
    if 'supervisor' in data_dict:
        if type(data_dict['supervisor']) == str:
            data_dict['supervisor'] = data_dict['supervisor'].split(',')
    if 'processing_state' in data_dict:
        if type(data_dict['processing_state']) == str:
            data_dict['processing_state'] = data_dict['processing_state'].split(',')
    return data_dict


def request_data_validation(queue_id):
    """
    This function will validate the input data provided for
    creation of the case queue.
    :param queue_id: queue_id to be validated
    :return: Boolean flag. If input data is valid
    then return True else False
    """
    valid_flag = True
    query = {'queue_id': int(queue_id)}
    projection = {'_id': 0}
    queue_data = MongoDbConn.find_one(CASE_QUEUE_COLLECTION, query,
                                      projection=projection)
    if queue_data:
        valid_flag = False
    return valid_flag


def prepare_doc_life_cycle_data(doc_state, data, context):
    """
    This function will prepare and return the updated payload data
    with updated life cycle data of the document
    :param doc_state: current state of the document
    :param data: payload data
    :param context: Logger Object
    :return: updated payload data
    """
    try:
        template_id = data['template_id'] if 'template_id' in data else None
        solution_id = data['solution_id'] if 'solution_id' in data else None
        document_info = MongoDbConn.find_one(DOCUMENTS_COLLECTION,{'doc_id':data['doc_id']})
        if 'life_cycle' in document_info:
            queue_id = None
            if doc_state in document_info['life_cycle']:
                queue_id = document_info['life_cycle'][doc_state]['queue_id']
            if queue_id is None:
                doc_life_cycle_data = get_default_doc_lifecycle_data(doc_state,
                                                                     context,
                                                                     template_id,
                                                                     solution_id)
                data['life_cycle'] = document_info['life_cycle']
                data['life_cycle'][doc_state] = doc_life_cycle_data
        else:
            doc_life_cycle_data = get_default_doc_lifecycle_data(doc_state,
                                                                 context,
                                                                 template_id,
                                                                 solution_id)
            temp_doc_state_dict = dict()
            temp_doc_state_dict[doc_state] = doc_life_cycle_data
            data['life_cycle'] = temp_doc_state_dict
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    return data


def get_default_doc_lifecycle_data(doc_state, context,template_id,solution_id):
    """
    This function will prepare and return the default
    values of document life cycle
    :param doc_state: current doc_state of the document
    :param context: Logger Object
    :return: document life cycle default values
    """
    temp_dict = dict()
    queue_id, queue_name = get_queue_details(doc_state, context,template_id,solution_id)
    temp_dict.update({'is_assigned': False,
                      'assignee': None,
                      'assigned_ts': None,
                      'closed_ts' : None,
                      'status': 'New',
                      'queue_id': queue_id,
                      'queue_name': queue_name
                      })
    return temp_dict


def get_queue_details(doc_state, context,template_id, solution_id):
    """
    This function will scan the case_queue collection and return the
    queue_id and queue name for the given doc_state
    :param doc_state: current state of the document
    :param context: Logger Object
    :param template_id
    :param solution_id
    :return: queue_id and queue_name related to doc_state
    """
    try:
        query = {'processing_state': doc_state,
                 'document_type': template_id,
                 'solution_id': solution_id}
        projection = {'_id': 0, 'queue_id': 1, 'queue_name': 1}
        queue_data = MongoDbConn.find_one(CASE_QUEUE_COLLECTION, query,
                                          projection=projection)
        queue_id, queue_name = None, None
        if queue_data:
            if 'queue_id' in queue_data:
                queue_id = queue_data['queue_id']
            if 'queue_name' in queue_data:
                queue_name = queue_data['queue_name']
        return queue_id, queue_name
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None, None


def get_child_documents(request):
    """
    This API accepts the doc_id and returns the details of the child documents
    :param request: GET API request
    :return: list of dictionaries consists the details of the child documents
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == 'POST':
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            parent_doc_id = payload['doc_id']
            parent_queue_id = payload['queue_id']
            if payload:
                return get_child_docs(parent_doc_id, parent_queue_id,
                                      solution_id, context)
        return {'status': 'failure',
                'msg': 'Only POST request will be accepted.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'msg': 'Failed to fetch child documents.'}
    finally:
        context.end_span()


def get_child_docs(parent_doc_id, parent_queue_id, solution_id, context):
    """
    This function will fetch the child documents details and return it.
    :param parent_doc_id: parent document ID
    :param parent_queue_id : parent queue id
    :param solution_id: solution_id
    :param context: Logger object
    :return: details of child documents
    """
    try:
        query = {'doc_id': parent_doc_id}
        projection = {'_id': 0, 'children': 1, 'doc_state': 1}
        parent_doc = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query,
                                          projection=projection)
        if 'children' in parent_doc:
            return fetch_child_doc_details(parent_doc, solution_id,
                                           parent_queue_id, context)
        else:
            return {'status': 'failure',
                    'msg': 'Failed to fetch child documents.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'msg': 'Failed to fetch child documents.'}


def fetch_child_doc_details(parent_doc, solution_id, parent_queue_id, context):
    """
    This function returns the details of the child documents
    based on the queue information
    :param parent_doc: Parent document
    :param solution_id: solution_id
    :param parent_queue_id: Queue in which parent document is visible
    :param context: Logger object
    :return: details of the child documents
    """
    try:
        child_doc_list = parent_doc['children']
        if parent_queue_id == 'uncategorized':
            query = {'solution_id': solution_id, 'is_deleted': False}
            projection = {'_id': 0}
            queue = MongoDbConn.find(CASE_QUEUE_COLLECTION, query,
                                     projection=projection)
        else:
            queue = get_queue_name(int(parent_queue_id), context, queue_name=False)
        query = {'doc_id': {'$in': child_doc_list}}
        projection = {'_id': 0}
        child_docs = MongoDbConn.find(DOCUMENTS_COLLECTION, query,
                                          projection=projection)
        if child_docs:
            child_documents = []
            for document in child_docs:
                group_templates = []
                if document["metadata"]["template_info"]["id"] == "" and "page_groups" in document:
                    if document["page_groups"]:
                        for group in document["page_groups"]:
                            if "template_id" in group:
                                group_templates.append(group["template_id"])
                temp_doc = update_document_info(document)
                if parent_queue_id == "uncategorized":
                    queue_found = False
                    for q in queue:
                        if document_queue_comparision(document, q, group_templates):
                            temp_doc.update({'highlight': False})
                            queue_found = True
                            break
                    if not queue_found:
                        temp_doc.update({'highlight': True})
                else:
                    if document_queue_comparision(document, queue, group_templates):
                        temp_doc.update({'highlight': True})
                    else:
                        temp_doc.update({'highlight': False})
                child_documents.append(temp_doc)
            return {'status': 'success', 'msg': 'Child documents fetched successfully.',
                    'data': child_documents}
        return {'status': 'failure',
                'msg': 'Failed to fetch child documents.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'msg': 'Failed to fetch child documents.'}


def document_queue_comparision(document, queue, group_templates):
    """
    This method compare the queue and document collection record
    and return the status flag
    :param document: document record
    :param queue: queue record
    :param group_templates: group templates list
    :return:
    """
    if document["doc_state"] in queue["processing_state"] \
            and ("all" in queue["document_type"] or
                 ("template_id" in document and document["template_id"] in queue["document_type"]) or
                 ("template_id" not in document and (set(group_templates) & set(queue["document_type"])))):
        return True
    if document["doc_state"] in queue["processing_state"]:
        if "life_cycle" in document:
            life_cycle = document["life_cycle"]
            for item in life_cycle:
                data = life_cycle[item]
                if "queue_id" in data and data["queue_id"] == queue["queue_id"]:
                    return True
    return False


def extract_default_variable(context):
    """
    This function will return the default variables
    :param context: Logger object
    :return: default variables
    """
    try:
        doc_variables = get_variable(context)
        default_variable = []
        for ele in doc_variables:
            if ele["is_default"]:
                default_variable.append(ele)
        return default_variable
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def workflow_management_service(request):
    """
    This function will handle all CRUD apis related to workflow
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        try:
            payload = json.loads(request.body.decode())
        except:
            payload = request.POST
        if request.method == 'POST':
            if 'workflow_id' in payload:
                try:
                    query = {'workflow_id': int(payload['workflow_id']), 'solution_id': solution_id,
                             'is_deleted': False}
                    workflow_data = MongoDbConn.find_one(WORKFLOW_COLLECTION, query, {"_id": 0})
                    if 'workflow_name' in payload:
                        workflow_data['workflow_name'] = payload['workflow_name']
                    if 'workflow_description' in payload:
                        workflow_data['workflow_description'] = payload['workflow_description']
                    else:
                        workflow_data['workflow_description'] = ''
                    if 'is_deleted' in payload:
                        workflow_data['is_deleted'] = payload['is_deleted']
                    if 'is_enabled' in payload:
                        workflow_data['is_enabled'] = payload['is_enabled']
                    if 'case_object' in payload:
                        workflow_data['case_object'] = payload['case_object']
                    workflow_data['updated_ts'] = datetime.utcnow().isoformat()
                    update_query = {"workflow_id": payload["workflow_id"], 'solution_id': solution_id,
                                    'is_deleted': False}
                    MongoDbConn.update(WORKFLOW_COLLECTION, update_query, workflow_data)
                    return {'status': 'success', "status_code":STATUS_CODES['OK'],
                            'msg': 'Workflow has been updated successfully.'}
                except Exception as e:
                    return {'status': 'failure', "status_code": STATUS_CODES['CONFLICT'],
                            'msg': 'Some error occurred while updating the workflow.'}
            elif 'workflow_name' in payload:
                try:
                    query = {'is_deleted': False, 'solution_id': solution_id}
                    projection = {'_id': 0, 'workflow_id': 1, 'workflow_name': 1}
                    workflow_data = MongoDbConn.find(WORKFLOW_COLLECTION, query,
                                               projection=projection).sort('workflow_id', -1)
                    if workflow_data:
                        wf_data = [ele for ele in workflow_data]
                    else:
                        wf_data = []
                    prev_wf_id = 100000
                    for ele in wf_data:
                        if 'workflow_name' in ele:
                            if ele['workflow_name'].strip() == payload['workflow_name'].strip():
                                return {'status': 'failure', "status_code": STATUS_CODES['FOUND'],
                                        'msg': 'Workflow name is already exists.'}
                    for ele in wf_data:
                        if 'workflow_id' in ele:
                            prev_wf_id = ele['workflow_id']
                            break
                    default_variable = extract_default_variable(context)
                    wf_dict = {'solution_id': solution_id,
                               'is_deleted': False,
                               'created_ts': datetime.utcnow().isoformat(),
                               'updated_ts': datetime.utcnow().isoformat(),
                               'workflow_id': int(prev_wf_id+1),
                               'workflow_name': payload['workflow_name'],
                               'is_enabled': True,
                               'case_object': default_variable}
                    if 'workflow_description' in payload:
                        wf_dict.update({'workflow_description': payload['workflow_description']})
                    MongoDbConn.insert(WORKFLOW_COLLECTION, wf_dict)
                    return {'status': 'success', "status_code": STATUS_CODES['OK'],
                            'msg': 'Workflow has been created successfully.'}
                except Exception as e:
                    return {'status': 'failure', "status_code": STATUS_CODES['CONFLICT'],
                            'msg': 'Some error occurred while creating the workflow.'}
            else:
                try:
                    filter_obj = {"page_no": 1, "no_of_recs": 20,
                                  "sort_by": "updated_ts", "order_by": False}
                    if 'filter_obj' in payload:
                        filter_obj = payload['filter_obj']
                    query = {"solution_id": solution_id, 'is_deleted': False}
                    projection = {'_id': 0}
                    workflows = MongoDbConn.find(WORKFLOW_COLLECTION, query,
                                                 projection=projection)
                    if workflows:
                        workflows = [workflow for workflow in workflows]
                        workflows_name = get_names(workflows, 'workflow_name', context)
                        filtered_workflows, total_workflows = implement_pagination(workflows,
                                                                                   filter_obj,
                                                                                   'updated_ts')
                        filtered_workflows = add_case_queue_count(filtered_workflows, solution_id, context)
                        return {'status': 'success', 'data': filtered_workflows, "status_code": STATUS_CODES['OK'],
                                'msg': 'Workflow list has been fetched successfully.',
                                'total_workflows': total_workflows, 'workflow_name': workflows_name}
                    else:
                        return {'status': 'success', 'data': [], "status_code": STATUS_CODES['NO_CONTENT'],
                                'msg': 'No Workflow list found.',
                                'total_workflows': 0}
                except Exception as e:
                    return {'status': 'failure', 'msg': 'Some error occurred while fetching the workflow list.',
                            "status_code":STATUS_CODES['CONFLICT'] }
        if request.method == 'DELETE':
            try:
                payload = json.loads(request.body.decode())
                if "workflow_id" not in payload:
                    return {'status': 'failure','msg': 'workflow id is missing in payload.',
                            "status_code": STATUS_CODES['PRECONDITION_FAILED']}
                update_query = {"workflow_id": int(payload["workflow_id"]), 'solution_id': solution_id,
                                'is_deleted': False}
                data = MongoDbConn.find_one(WORKFLOW_COLLECTION, update_query, {'_id': 0})
                if not data:
                    return {'status': 'failure', 'msg': "Data not found", "status_code": STATUS_CODES['NOT_FOUND']}
                if 'is_deleted' in data:
                    data.update({'is_deleted': True,
                                 'is_enabled': False,
                                 'updated_ts': datetime.utcnow().isoformat()})
                    MongoDbConn.update(WORKFLOW_COLLECTION, update_query, data)
                return {'status': 'success','msg': 'workflow sucessfully deleted', "status_code": STATUS_CODES['DELETED']}
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                return {'status': 'failure', 'msg': 'Some error occurred while deleting the workflow.',
                        "status_code": STATUS_CODES['CONFLICT']}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure','msg': 'Method not allowed',
                "status_code":STATUS_CODES['METHOD_NOT_ALLOWED']}
    finally:
        context.end_span()


def add_case_queue_count(workflows, solution_id, context):
    """
    This function will count the case queues for each workflow
    and return the updated workflow dictionary as response
    :param workflows: workflow for a solution
    :param solution_id: Session Solution Id
    :param context: logger object
    :return: updated workflow dictionary as response
    """
    try:
        for workflow in workflows:
            query = {'workflow_id': workflow['workflow_id'], 'is_deleted': False,
                     'solution_id': solution_id}
            projection = {'_id': 0}
            case_queues_count = MongoDbConn.find(WORKFLOW_QUEUE_COLLECTION, query,
                                                 projection=projection).count()
            if case_queues_count:
                workflow['queue_count'] = case_queues_count
            else:
                workflow['queue_count'] = 0
        return workflows
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to count case queues.'}


def get_variable(context):
    """
    This function will fetch all workflow variables
    and return the list as response
    :param logger_obj: logging object
    :return: list as response
    """
    try:
        case_variables = get_case_vars(context)
        new_case_variables = sorted(case_variables, key=lambda k: k['alias'])
        return new_case_variables
    except Exception as e:
        context.log(message=str(e), obj={"tb":traceback.format_exc()})
        return []


def get_workflow_variables(request):
    """
    This function will collect the document and domain objects variables
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == 'GET':
            case_variables = get_variable(context)
            case_variables.extend(get_doc_level_variables(context))
            case_variables.extend(get_domain_object_variables(solution_id, context))
            return {'status': 'success',
                    'msg': 'Workflow variables fetched successfully.',
                    'data': case_variables,
                    'total_variables': len(case_variables),
                    'status_code': STATUS_CODES['OK']}
        if request.method == 'POST':
            return save_case_variables(request, context)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch variables.'}
    finally:
        context.end_span()


def fetch_case_object(request):
    """
    This function will fetch the case object from collection
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        if request.method == 'POST':
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            if 'solution_id' in payload:
                solution_id = payload['solution_id']
            else:
                solution_id = get_solution_from_session(request)
            if 'workflow_id' not in payload:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['PRECONDITION_REQUIRED'],
                        'msg': 'Workflow_id is missing in request payload.'}
            workflow_id = payload['workflow_id']
            query = {'workflow_id': int(workflow_id), 'solution_id': solution_id,
                     'is_deleted': False}
            projection = {'_id': 0, 'case_object': 1}
            wf_data_dict = MongoDbConn.find_one(WORKFLOW_COLLECTION, query,
                                                projection=projection)
            if wf_data_dict and 'case_object' in wf_data_dict:
                return {'status': 'success',
                        'msg': 'Case object fetched successfully.',
                        'data': wf_data_dict['case_object'],
                        'status_code': STATUS_CODES['OK']}
            else:
                return {'status': 'success',
                        'msg': 'Case object not available.',
                        'data': [],
                        'status_code': STATUS_CODES['NO_CONTENT']}
        return {'status': 'failure',
                'status_code': STATUS_CODES['BAD_REQUEST'],
                'msg': 'Only POST request will be accepted.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch variables.'}
    finally:
        context.end_span()


def save_case_variables(request, context):
    """
    This function will save/update the case variables in workflow
    collection and return the dictionary as response
    :param request: Http request
    :param context: logger object
    :return: dictionary as response
    """
    try:
        try:
            payload = json.loads(request.body.decode())
        except:
            payload = request.POST
        if 'solution_id' in payload and payload['solution_id'].strip() \
                and payload['solution_id'].strip() != '':
            solution_id = payload['solution_id']
        else:
            solution_id = get_solution_from_session(request)
        if 'workflow_id' not in payload:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['PRECONDITION_REQUIRED'],
                    'msg': 'Workflow_id is missing in request payload.'}
        workflow_id = payload['workflow_id']
        query = {'workflow_id': int(workflow_id), 'solution_id': solution_id,
                 'is_deleted': False}
        projection = {'_id': 0}
        wf_data_dict = MongoDbConn.find_one(WORKFLOW_COLLECTION, query,
                                            projection=projection)
        wf_data_dict['updated_ts'] = datetime.utcnow().isoformat()
        case_object = []
        if 'case_object' in payload:
            case_object = payload['case_object']
        if valid_case_object(case_object, context):
            wf_data_dict['case_object'] = case_object
            MongoDbConn.update(WORKFLOW_COLLECTION, query, wf_data_dict)
            return {'status': 'success', "status_code": STATUS_CODES['OK'],
                    'msg': 'case object saved successfully.'}
        else:
            return {'status': 'failure', "status_code": STATUS_CODES['NOT_ACCEPTABLE'],
                    'msg': 'Alias should be unique.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to save case variables.'}


def valid_case_object(case_objects, context):
    """
    This function will parse the case object list
    and validate it for unique alias
    and return the boolean value
    :param case_objects: List of variables
    :param context: Logger object
    :return: Boolean value
    """
    try:
        unique_alias_dict = dict()
        for case_obj in case_objects:
            if case_obj['alias'] in unique_alias_dict:
                return False
            unique_alias_dict[case_obj['alias']] = 1
        return True
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return False


def get_doc_level_variables(context):
    """
    This function will fetch the document level variables
    and return the list of document variables
    :param context: Logger object
    :return: list of document variables
    """
    try:
        with open('doc_vars.json') as document_vars:
            document_vars_data = json.load(document_vars)
        if 'doc_vars' in document_vars_data:
            temp_doc_var_list = document_vars_data['doc_vars']
            return sorted(temp_doc_var_list, key=lambda k: k['alias'])
        else:
            return []
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def get_domain_object_variables(solution_id, context):
    """
    This function will fetch the domain objects level variables
    and return the list of variables as response
    :param solution_id: Session solution id
    :param context: Logger object
    :return: list of variables as response
    """
    try:
        config = config_from_endpoint(ENTITY_CONFIG, 'download')
        response = entity_download(solution_id, 'json', config)
        if response['status'] == "success":
            return get_domain_obj_vars(response["file_path"], solution_id, context)
        return []
        # return get_domain_obj_vars(context)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def get_domain_obj_vars(file_path, solution_id, context):
# def get_domain_obj_vars(context):
    """
    This function will process the file exist at file_path
    and return the list of domain objects variables
    :param file_path: relative file path received from entity service
    :param context: Logger object
    :param solution_id: Session solution Id
    :return: list of domain objects variables
    """
    abs_file_path = save_file_fetched_from_efs(file_path, solution_id,
                                               context)
    # abs_file_path = '/home/xpms/Downloads/cms_7011389e-4f39-467c-a9c8-f284a704bcd6_domain_objects.json'
    if abs_file_path:
        try:
            with open(abs_file_path) as entity_domain_obj_data:
                domain_obj_data = json.load(entity_domain_obj_data)
            if 'entities' in domain_obj_data:
                return process_domain_obj_vars(domain_obj_data['entities'],
                                               context)
            else:
                return []
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return []
    else:
        return []


def process_domain_obj_vars(entity_data, context):
    """
    This function will process the json content
    and return the domain variables as list
    :param entity_data: json file content in json format
    :param context: Logger object
    :return: domain variables as list
    """
    try:
        domain_vars = []
        for ele in entity_data:
            if 'entity_type' not in ele:
                continue
            if ele['entity_type'] != 'domain_object':
                continue
            d_var = ele['entity_name']
            if 'attributes' in ele:
                domain_dict = {'isdefault': False,
                               'dimension': 'Domain',
                               'name': d_var,
                               'alias': d_var.replace('.', '_'),
                               'type': ele['entity_type'],
                               'variable_id': str(uuid4()),
                               'attributes': [],
                               'path_mapping': d_var}
                domain_vars.append(process_entity_vars(entity_data,
                                                       ele['attributes'],
                                                       context, d_var,
                                                       domain_dict, d_var))
            else:
                domain_vars.append({'isdefault': False,
                                    'dimension': 'Domain',
                                    'name': d_var,
                                    'alias': d_var.replace('.', '_'),
                                    'type': ele['entity_type'],
                                    'variable_id': str(uuid4()),
                                    'attributes': [],
                                    'path_mapping': d_var})
        sorted_domain_vars = sorted(domain_vars, key=lambda k: k['alias'])
        return sorted_domain_vars
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def find_entity(key_name, entity_data):
    """
    This function will find the entity based on the entity name
    and return the entity
    :param key_name:
    :param entity_data:
    :return:
    """
    for entity in entity_data:
        if entity["entity_name"] == key_name:
            return entity
    return None


def process_entity_vars(entity_data, entity_objs, context, d_var, domain_dict, modified_var):
    """
    This function will process the entity data
    and return the list of dictionaries as response
    :param entity_data: entities data
    :param entity_objs: entity data
    :param context: logger object
    :param d_var: domain name
    :param domain_dict: domain level dictionary
    :param modified_var: modified variable string
    :return: list of dictionaries as response
    """
    try:
        for obj in entity_objs:
            if "entity_relation" in obj and "name" in obj["entity_relation"]:
                e_var = d_var
                d_var += '.' + obj['key_name']
                inner_domain_dict = {'is_default': False,
                                     'dimension': 'Domain',
                                     'name': obj['key_name'],
                                     'alias': obj['key_name'].replace('.', '_'),
                                     'type': obj['type'],
                                     'variable_id': str(uuid4()),
                                     'attributes': [],
                                     'path_mapping': d_var}
                entity = find_entity(obj['key_name'], entity_data)
                if entity and isinstance(entity, dict) and 'attributes' in entity:
                    domain_dict['attributes'].append(process_entity_vars(entity_data,
                                                                         entity['attributes'],
                                                                         context, d_var,
                                                                         inner_domain_dict, d_var))
                    d_var = e_var
                else:
                    domain_dict['attributes'].append({'is_default': False,
                                                      'dimension': 'Domain',
                                                      'name': obj['key_name'],
                                                      'alias': obj['key_name'].replace('.', '_'),
                                                      'type': obj['type'],
                                                      'variable_id': str(uuid4()),
                                                      'attributes': [],
                                                      'path_mapping': modified_var + '.' + obj['key_name']})
            else:
                domain_dict['attributes'].append({'is_default': False,
                                                  'dimension': 'Domain',
                                                  'name': obj['key_name'],
                                                  'alias': obj['key_name'].replace('.', '_'),
                                                  'type': obj['type'],
                                                  'variable_id': str(uuid4()),
                                                  'attributes': [],
                                                  'path_mapping': modified_var + '.' + obj['key_name']})
        return domain_dict
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


# def create_doc_var_json(doc_id):
def create_doc_var_json():
    """
    This function will create a json file which consists
    the document level variable
    :param doc_id: document id
    :return: file save
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        # # doc_id = '02375897-436c-4692-b1a3-ca573674978b'
        # query = {'doc_id': doc_id}
        # projection = {'_id': 0}
        # resp = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query, projection=projection)
        resp = {"processing_state":"AAA",
                "root_id":"BBB",
                "is_root":True,
                "doc_id": "DDD",
                "doc_state":"processing",
                "solution_id": "endtoend_3a7db947-0aba-4422-b86f-6d039a111f68",
                "metadata":{"properties":{"num_pages":0,
                                          "size":80435,
                                          "filename":"CCC",
                                          "extension":".pdf"},
                            "template_info":{"score":0,
                                             "name":"",
                                             "id":""}
                            },
                "children":[{}],
                "elements":[{"confidence":80,
                             "type":"section",
                             "elements":[{"score":80.0,
                                          "confidence":80.0,
                                          "label":"EEE",
                                          "type":"field",
                                          "parameters":{"label":"EEE",
                                                        "text":"VVV",
                                                        "has_label":True},
                                          "has_label":True,
                                          "text":"VVV"
                                         }],
                             "parameters":{}
                            }],
                "page_groups":[{"score":0.00121985247672529,
                                "template_id":"unknown",
                                "template_name":"unknown",
                                "start_page":1,
                                "end_page":4,
                                "template_score":0
                                }]
                }
        vars_list = list()
        for ele in resp:
            if isinstance(resp[ele], dict) or isinstance(resp[ele], list):
                if isinstance(resp[ele], dict):
                    src = [resp[ele]]
                else:
                    src = resp[ele]
                if len(src) > 0:
                    for item in src:
                        if len(item.keys()) > 0:
                            for tmp in item:
                                doc_var_dict = {'is_default': False,
                                                'dimension': 'Document',
                                                'name': tmp,
                                                'type': 'text',
                                                'variable_id': str(uuid4()),
                                                'attributes': [],
                                                'path_mapping': ele + '.' + tmp}
                                if isinstance(item[tmp], dict) or isinstance(item[tmp], list):
                                    if isinstance(item[tmp], list):
                                        for i in item[tmp]:
                                            vars_list.append(get_doc_vars(i, ele + '.' + tmp, doc_var_dict, context))
                                    else:
                                        vars_list.append(get_doc_vars(item[tmp], ele + '.' + tmp, doc_var_dict, context))
                                else:
                                    vars_list.append(doc_var_dict)
                        else:
                            vars_list.append({'is_default': False,
                                              'dimension': 'Document',
                                              'name': ele,
                                              'type': 'text',
                                              'variable_id': str(uuid4()),
                                              'attributes': [],
                                              'path_mapping': ele})
                else:
                    pass
            else:
                vars_list.append({'is_default': False,
                                'dimension': 'Document',
                                'name': ele,
                                'type': 'text',
                                'variable_id': str(uuid4()),
                                'attributes': [],
                                'path_mapping': ele})
        # doc_var_dict = get_doc_vars(resp, doc_var_dict, '', context)
        doc_var_dict = {'doc_vars': vars_list}
        with open('/tmp/doc_vars.json', 'w') as fw:
            json.dump(doc_var_dict, fw)
        fw.close()
        return {'status': 'success'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def get_doc_vars(resp_dict, path, doc_var_dict, context):
    """
    This function will parse the resp_dict and get the list of doc variables
    :param resp_dict: doc variables dictionary
    :param path: Json path
    :param doc_var_dict: document variable mapping dictionary
    :param context: logger object
    :return: doc variables list
    """
    try:
        for ele in resp_dict:
            if isinstance(resp_dict[ele], dict) or isinstance(resp_dict[ele], list):
                if isinstance(resp_dict[ele], dict):
                    src = [resp_dict[ele]]
                else:
                    src = resp_dict[ele]
                if len(src) > 0:
                    for item in src:
                        if len(item.keys()) > 0:
                            for tmp in item:
                                var_dict = {'is_default': False,
                                            'dimension': 'Document',
                                            'name': tmp,
                                            'type': 'text',
                                            'variable_id': str(uuid4()),
                                            'attributes': [],
                                            'path_mapping': path + '.' + ele + '.' + tmp}
                                if (isinstance(item[tmp], dict) and item[tmp]) or  isinstance(item[tmp], list):
                                    doc_var_dict['attributes'].append(get_doc_vars(item[tmp], path + '.' + ele, var_dict, context))
                                else:
                                    doc_var_dict['attributes'].append(var_dict)
                        else:
                            doc_var_dict['attributes'].append({'is_default': False,
                                                               'dimension': 'Document',
                                                               'name': ele,
                                                               'type': 'text',
                                                               'variable_id': str(uuid4()),
                                                               'attributes': [],
                                                               'path_mapping': path + '.' + ele})
                else:
                    pass
            else:
                doc_var_dict['attributes'].append({'is_default': False,
                                                   'dimension': 'Document',
                                                   'name': ele,
                                                   'type': 'text',
                                                   'variable_id': str(uuid4()),
                                                   'attributes': [],
                                                   'path_mapping': path + '.' + ele})
        return doc_var_dict
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {}


def implement_workflow_case_queues(request):
    """
    This service will implement CRUD operation related to case queues
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == 'GET':
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'GET request will not be accepted.'}
        try:
            payload = json.loads(request.body.decode())
        except:
            payload = request.POST
        if not payload:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to get payload from http request.'}
        if request.method == 'POST':
            return perform_case_queue_operations(payload, solution_id,
                                                 context)
        if request.method == 'DELETE':
            return delete_case_queue(payload, solution_id, context)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to perform CRUD operations on case queues.'}
    finally:
        context.end_span()


def perform_case_queue_operations(payload, solution_id, context):
    """
    This function will perform the create, update and read operations
    on case queues and return the dictionary as response
    :param payload: Http request payload
    :param solution_id: Session solution id
    :param context: Logger object
    :return: dictionary as response
    """
    if 'case_queue_id' in payload:
        return update_case_queue(payload, solution_id, context)
    if 'case_queue_name' in payload:
        return create_case_queues(payload, solution_id, context)
    return get_case_queues(payload, solution_id, context)


def update_case_queue(payload, solution_id, context):
    """
    This function will update the workflow case queues
    and return the dictionary as response
    :param payload: Http request payload
    :param solution_id : session solution id
    :param context: Logger object
    :return: dictionary as response
    """
    try:
        case_queue_id = int(payload['case_queue_id'])
        query = {'case_queue_id': case_queue_id, 'solution_id': solution_id,
                 'is_deleted': False}
        projection = {'_id': 0}
        case_queue_dict = MongoDbConn.find_one(WORKFLOW_QUEUE_COLLECTION,
                                               query, projection=projection)
        if case_queue_dict:
            case_queue_dict['updated_ts'] = datetime.utcnow().isoformat()
            if 'case_queue_name' in payload:
                case_queue_dict['case_queue_name'] = payload['case_queue_name']
            if 'user_groups' in payload:
                case_queue_dict['user_groups'] = payload['user_groups']
            rules_data = []
            if 'rules' in payload:
                rules_data = payload['rules']
            rule_id = ''
            if 'rule_id' in payload:
                rule_id = payload['rule_id']
            rule_id = get_rule_id(rules_data, solution_id, context,
                                  rule_id=rule_id)
            case_queue_dict['rule_id'] = rule_id
            MongoDbConn.update(WORKFLOW_QUEUE_COLLECTION, query,
                               case_queue_dict)
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Successfully updated the case queue.'}
        return {'status': 'failure',
                'status_code': STATUS_CODES['NO_CONTENT'],
                'msg': 'Failed to delete case queue.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to update workflow case queue.'}


def create_case_queues(payload, solution_id, context):
    """
    This function will insert workflow case queues into db
    and return the dictionary as response
    :param payload: Http request payload
    :param solution_id: Session solution id
    :param context: Logger object
    :return: dictionary as response
    """
    try:
        if 'workflow_id' not in payload:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['PRECONDITION_REQUIRED'],
                    'msg': 'Workflow_id is missing in request payload.'}
        projection = {"_id": 0, 'case_queue_id': 1, 'case_queue_name': 1}
        query_name_check = {'workflow_id':int(payload['workflow_id']),
                            'is_deleted': False, 'solution_id': solution_id}
        database_data_name_check = MongoDbConn.find(WORKFLOW_QUEUE_COLLECTION,
                                                    query_name_check,
                                                    projection=projection)
        if database_data_name_check:
            db_data_name = [ele for ele in database_data_name_check]
        else:
            db_data_name = []
        for ele in db_data_name:
            if ele['case_queue_name'].strip() == payload['case_queue_name'].strip():
                return {'status': 'failure',
                        'status_code': STATUS_CODES['FOUND'],
                        'msg': 'Workflow case queue name is already exists.'}
        query_id_check = {'solution_id': solution_id, 'is_deleted': False}
        database_data_id_check = MongoDbConn.find(WORKFLOW_QUEUE_COLLECTION,
                                                  query_id_check,
                                                  projection=projection).sort('case_queue_id', -1)
        if database_data_id_check:
            db_data = [ele for ele in database_data_id_check]
        else:
            db_data = []

        prev_case_queue_id = 100000
        for ele in db_data:
            if 'case_queue_id' in ele:
                prev_case_queue_id = int(ele["case_queue_id"])
                break
        prev_case_queue_id += 1
        rule_id = ''
        if 'rules' in payload:
            rules = payload['rules']
            rules['rule_name'] = str(prev_case_queue_id)
            rule_id = get_rule_id(rules, solution_id, context)
        case_queue_dict = payload
        case_queue_dict.update({'is_deleted': False,
                                'created_ts': datetime.utcnow().isoformat(),
                                'updated_ts': datetime.utcnow().isoformat(),
                                'solution_id': solution_id,
                                'case_queue_id': prev_case_queue_id,
                                'workflow_id': int(payload['workflow_id']),
                                'rule_id': rule_id})
        case_queue_dict.pop('rules')
        MongoDbConn.insert(WORKFLOW_QUEUE_COLLECTION, case_queue_dict)
        return {"status": "success", 'status_code': STATUS_CODES['CREATED'],
                'msg': 'Workflow case queue has been created successfully.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to insert workflow case queue.'}


def fetch_case_queue_rules(request, rule_id):
    """
    This function will get the case queue rules based on rule_id
    and return the rules json as response
    :param request: Http request
    :param rule_id: rule_id
    :return: rules json as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == 'GET':
            rules = None
            resp = get_rule(solution_id, rule_id=rule_id)
            if resp["status"] == "success":
                rules = resp["data"]
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Successfully fetched the case queue rules.',
                    'data': rules}
        else:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'Only GET requested will be accepted.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch rules json for case queue.'}
    finally:
        context.end_span()


def get_rule_id(rules_data, solution_id, context, rule_id=None):
    """
    This function will save the case queues rules at rule engine
    and return the rule_id as response
    :param rules_data: rules payload
    :param solution_id: session solution_id
    :param context: logger object
    :return: rule_id as response
    """
    try:
        resp = update_rule(solution_id, rules_data)
        if resp["status"] == "success":
            rule_id = resp["rule_id"]
        return rule_id
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch rule_id for case queue.'}


def get_case_queues(payload, solution_id, context):
    """
    This function will fetch the workflow case queues
    and return the dictionary as response
    :param payload: Http request payload
    :param solution_id: Session solution id
    :param context: Logger object
    :return: dictionary as response
    """
    try:
        if 'workflow_id' not in payload:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['PRECONDITION_REQUIRED'],
                    'msg': 'Workflow_id is missing in request payload.'}
        filter_obj = {'page_no': 1, 'no_of_recs': 20,
                      'sort_by': 'updated_ts', 'order_by': False}
        if 'filter_obj' in payload:
            filter_obj = payload['filter_obj']
        query = {'solution_id': solution_id, 'workflow_id': int(payload['workflow_id']),
                 'is_deleted': False}
        projection = {'_id': 0}
        case_queues = MongoDbConn.find(WORKFLOW_QUEUE_COLLECTION, query,
                                       projection=projection)
        case_queues = [case_queue for case_queue in case_queues]
        queues_name = get_names(case_queues, 'case_queue_name', context)
        filtered_case_queues, total_case_queues = implement_pagination(case_queues,
                                                                       filter_obj,
                                                                       'updated_ts')
        return {"status": "success", "data": filtered_case_queues,
                'total_queues': total_case_queues,
                'status_code': STATUS_CODES['OK'],
                'msg': 'Workflow case queues have been fetched successfully.',
                'queue_name': queues_name}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch workflow case queues.'}


def get_names(results, key, context):
    """
    This function will fetch the existing case queue name
    and return the list of queue name as response
    :param results: All case queues for a given workflow_id
    :param key: string to be compared
    :param context: Logger object
    :return: list of queue name as response
    """
    try:
        names = []
        for ele in results:
            if key in ele:
                names.append(ele[key])
        return names
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def delete_case_queue(payload, solution_id, context):
    """
    This function will perform the delete operation on case queue
    and return the dictionary as response
    :param payload: Http request payload
    :param solution_id: Session Solution_id
    :param context: Logger object
    :return: dictionary as response
    """
    try:
        case_queue_id = int(payload['case_queue_id'])
        query = {'case_queue_id': case_queue_id, 'solution_id': solution_id,
                 'is_deleted': False}
        projection = {'_id': 0}
        case_queue_dict = MongoDbConn.find_one(WORKFLOW_QUEUE_COLLECTION,
                                               query, projection=projection)
        if case_queue_dict and 'is_deleted' in case_queue_dict:
            case_queue_dict['is_deleted'] = True
            case_queue_dict['updated_ts'] = datetime.utcnow().isoformat()
            MongoDbConn.update(WORKFLOW_QUEUE_COLLECTION, query,
                               case_queue_dict)
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Successfully deleted the case queue.'}
        return {'status': 'failure',
                'status_code': STATUS_CODES['NO_CONTENT'],
                'msg': 'Failed to delete workflow case queue.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to delete workflow case queue.'}


def fetch_case_variables(request):
    """
    This function will fetch the case level variables
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        if request.method != 'GET':
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'Only GET request will be accepted.'}
        return get_case_vars(context)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to perform CRUD operations on case queues.'}
    finally:
        context.end_span()


def get_case_vars(context):
    """
    This function will read the static json file
    and return the dictionary consist of case variables as response
    :param context: Logger object
    :return: dictionary consist of case variables as response
    """
    try:
        with open('case_vars.json') as document_vars:
            document_vars_data = json.load(document_vars)
        if 'case_vars' in document_vars_data:
            return document_vars_data['case_vars']
        else:
            return []
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return []


def case_management_wf_service(request):
    """
    This function will forward the request to case management
    and collect the response from  case management and return it
    :param request: Http request
    :return: response from case management
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        full_path = request.get_full_path()
        path = '/'.join(full_path.split('/')[2:])
        method = request.method
        headers = {'authorization': request.META['HTTP_AUTHORIZATION']}
        payload = {}
        if method in ['POST', 'DELETE']:
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
        url = CASE_MANAGEMENT_SERVICE_URL + path
        if method == 'POST':
            resp = requests.post(url, data=json.dumps(payload), headers=headers)
            return json.loads(resp.text)
        if method == 'GET':
            resp = requests.get(url, headers=headers)
            return json.loads(resp.text)
        if method == 'DELETE':
            resp = requests.delete(url, data=json.dumps(payload), headers=headers)
            return json.loads(resp.text)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': {'success': False,
                           'msg': 'Failed to perform CRUD operations on workflows.',
                           'code': 500}
                }
    finally:
        context.end_span()
