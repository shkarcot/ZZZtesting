"""
@author: Rohit Kumar Jaju
@date: September 19, 2018
@purpose: The functions mentioned in this python class are responsible
          for mapping the documents and queues based on the user groups,
          user roles and rules associated to the queues.
          All functions are exposed as APIs.
"""

import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, STATUS_CODES,\
    DOCUMENTS_COLLECTION, DOC_COUNT, WORKFLOW_QUEUE_COLLECTION
from connections.mongodb import MongoDbConn
from utilities.common import get_solution_from_session,\
    get_pagination_details, get_user_id_from_session
from services.user_services import UserServices
from services.rules import get_rule
from math import floor,ceil,sqrt
import re
from services.dashboard import get_filtered_docs, update_document_info


class QueueDocMapper:
    """
    The functions mentioned in this python class are responsible
    for mapping the documents and queues based on the user groups,
    user roles and rules associated to the queues.
    All functions are exposed as APIs.
    """

    def __init__(self):
        """
        This is constructor for the QueueDocMapper class.
        It is responsible for creating the logger object.
        Also, it maintains the user_name, role, queue_id, filter_object
        and searched_text fields.
        """
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)
        self.us_obj = UserServices()
        self.operators = {'eq': self.oper_equal,
                          'lte': self.oper_less_than_equal,
                          'lt': self.oper_less_than,
                          "f to celsius": self.oper_f_to_celsius,
                          "in": self.oper_exists,
                          "nin": self.oper_not_exists,
                          'neq': self.oper_not_equal,
                          'gt': self.oper_greater_than,
                          'gte': self.oper_greater_than_equal,
                          'regx': self.oper_regex,
                          'regx-exists': self.oper_regex_exists,
                          'btw': self.oper_between,
                          'tes1': self.oper_tes1,
                          'cust_gt': self.oper_cust_greater_than,
                          'src_gt_target': self.oper_source_greater_than,
                          'equalscondition': self.oper_equal_condition,
                          'cutomcondition': self.oper_custom_condition}
        self.actions = {'trim': self.act_trim, 'no_fn': self.act_no_action,
                        'len': self.act_len, "toUpper": self.act_upper_case,
                        "toLower": self.act_lower_case, "ceil": self.act_ceil,
                        "floor": self.act_floor, "sqrt": self.act_sqrt,
                        'ltrim': self.act_left_trim, '': self.act_no_action,
                        'rtrim': self.act_right_trim}
        self.user_name = None
        self.filter_obj = {"page_no": 1, "no_of_recs": 8,
                           "sort_by": "created_ts", "order_by": False}
        self.role = 'bu'
        self.searched_text = ''

    def oper_source_greater_than(self, l_val, r_val):
        """
        This function will compare the operands
        and return the response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        return True

    def oper_custom_condition(self, l_val, r_val):
        """
        This function will compare the operands
        and return the response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        return True

    def oper_equal_condition(self, l_val, r_val):
        """
        This function will compare the operands
        and return the response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        return True

    def oper_cust_greater_than(self, l_val, r_val):
        """
        This function will compare the operands
        and return the response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        return True

    def oper_tes1(self, l_val, r_val):
        """
        This function will compare the operands
        and return the response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        return True

    def oper_between(self, l_val, r_val):
        """
        This function will compare the operands
        and return the boolean response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        if l_val in r_val:
            return True
        return False

    def oper_regex(self, l_val, r_val):
        """
        This function will compare the operands
        and return the boolean response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        if re.match(r_val, l_val):
            return True
        return False

    def oper_regex_exists(self, l_val, r_val):
        """
        This function will compare the operands
        and return the boolean response
        :param l_val: Left operand
        :param r_val: Right operand
        :return: response
        """
        if re.match(r_val, l_val):
            return True
        return False

    def oper_equal(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val == r_val

    def oper_greater_than(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val > r_val

    def oper_greater_than_equal(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val >= r_val

    def oper_less_than(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val < r_val

    def oper_less_than_equal(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val <= r_val

    def oper_not_equal(self, l_val, r_val):
        """
        This function will compare operands
        and return the boolean response
        :param l_val: left operand
        :param r_val: right operand
        :return: boolean value
        """
        return l_val != r_val

    def oper_f_to_celsius(self, l_val):
        """
        This function convert temperature from fahrenheit to celsius
        and return celsius
        :param l_val: temperature in fahrenheit
        :return: temperature in celsius
        """
        return (l_val - 32) * 1.8

    def oper_exists(self, l_val, r_val):
        """
        This function will check whether value is present in
        left operand or not and return the boolean response
        :param l_val: Left operand
        :param r_val: right operand
        :return: Boolean response
        """
        if re.search(r_val, l_val):
            return True
        else:
            return False

    def oper_not_exists(self, l_val, r_val):
        """
        This function will check whether value is present in
        left operand or not and return the boolean response
        :param l_val: Left operand
        :param r_val: right operand
        :return: Boolean response
        """
        if not re.search(r_val, l_val):
            return True
        else:
            return False

    def act_trim(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: boolean value
        """
        return str(l_val).strip()

    def act_left_trim(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: boolean value
        """
        return str(l_val).lstrip()

    def act_right_trim(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: boolean value
        """
        return str(l_val).rstrip()

    def act_no_action(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: boolean value
        """
        return l_val

    def act_len(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: boolean value
        """
        return len(str(l_val))

    def act_upper_case(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: converted upper case
        """
        return str(l_val).upper()

    def act_lower_case(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: converted lower case
        """
        return str(l_val).lower()

    def act_floor(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: floor value
        """
        return floor(l_val)

    def act_ceil(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: ceil value
        """
        return ceil(l_val)

    def act_sqrt(self, l_val):
        """
        This function will perform action on operand
        and return the boolean response
        :param l_val: left operand
        :return: square root
        """
        return sqrt(l_val)

    def get_all_queues_info(self, request):
        """
        This function is responsible for list of queues to be displayed
         along with all status count and return the dictionary as response
        :param request: Http request
        :return: dictionary as response
        """
        try:
            if request.method == "POST":
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                self.user_name = payload["user_name"]
                if 'filter_obj' in payload:
                    self.filter_obj = payload['filter_obj']
                if 'role' in payload:
                    self.role = payload['role']
                if 'searched_text' in payload:
                    self.searched_text = payload['searched_text'].strip()
                solution_id = get_solution_from_session(request)
                user_id = get_user_id_from_session(request)
                queues = self.get_user_related_queues(solution_id, user_id)
                documents = self.get_all_documents(solution_id)
                if self.searched_text != '':
                    filtered_documents = get_filtered_docs(documents,
                                                           self.searched_text)
                else:
                    filtered_documents = documents
                mapped_documents = self.map_document_queues(solution_id,
                                                            queues,
                                                            filtered_documents)
                if mapped_documents:
                    queues_name = self.get_queues_name(mapped_documents)
                    if 'queue_id' in payload:
                        queue_id = payload['queue_id']
                        if queue_id != 'uncategorized':
                            queue_id = int(queue_id)
                        if queue_id in mapped_documents:
                            doc_list = mapped_documents[queue_id]['documents']
                            return self.specific_queue_info(doc_list, queue_id,
                                                            queues_name, solution_id)
                        else:
                            return {'status': 'success', 'documents': [],
                                    'agents': [], 'status_code': STATUS_CODES['OK'],
                                    'state': list(),
                                    'total_documents': 0,
                                    'queue_name': queues_name}
                    return self.overall_queues_info(mapped_documents)
                else:
                    return {'status': 'failure',
                            'status_code': STATUS_CODES['BAD_REQUEST'],
                            'msg': 'No queues documents mapping available'}
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'Only POST request will be accepted.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process queue information request.'}
        finally:
            self.context.end_span()

    def get_queues_name(self, mapped_documents):
        """
        This function will parse the queue documents mapped dictionary
        and return the all queue name as list in response
        :param mapped_documents: queue documents mappped dictionary
        :return: list of queues name
        """
        try:
            queues_name = list()
            for ele in mapped_documents:
                queues_name.append(mapped_documents[ele]['queue_name']['queue_name'])
            return queues_name
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return list()

    def get_agents_list(self, queue_id, solution_id):
        """
        This function will first fetch the list of user_groups from the queue
        and then fetch all those BU users who are tagged to these user groups
        and return the list of BU users as response
        :param queue_id: Specific queue Id
        :param solution_id: Session solution id
        :return: list of BU users
        """
        try:
            mapped_users = list()
            user_group_details = self.get_user_groups(queue_id, solution_id)
            ug_details = list()
            if user_group_details and 'user_groups' in user_group_details:
                ug_details = user_group_details['user_groups']
            for ug_detail in ug_details:
                mapped_users.extend(self.get_mapped_users(ug_detail['id']))
            return mapped_users
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return list()

    def get_mapped_users(self, user_group_id):
        """
        This function will fetch the users information
        which are mapped to the specific user_group and
        return the list of the user name as response
        :param user_group_id: specific user_group id
        :return: list of mapped user name
        """
        try:
            user_name_list = list()
            ug_detail_resp = self.us_obj.get_user_groups(user_group_id)
            if ug_detail_resp and ug_detail_resp['status_code'] == 200:
                ug_resp = ug_detail_resp['result']
                if ug_resp and 'data' in ug_resp \
                    and 'members' in ug_resp['data']:
                    members = ug_resp['data']['members']
                    for ele in members:
                        if 'userName' in ele:
                            user_name_list.append(ele['userName'])
            return user_name_list
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return list()

    def get_user_groups(self, queue_id, solution_id):
        """
        This function will fetch the user_groups Ids present in the
        specific queue and return the details of user_group ids as response
        :param queue_id: Specific case queue id
        :param solution_id: Session solution id
        :return: details of user_group ids
        """
        try:
            query = {'id': queue_id, 'solution_id': solution_id}
            projection = {'user_groups': 1, '_id': 0}
            return MongoDbConn.find_one(WORKFLOW_QUEUE_COLLECTION, query,
                                        projection=projection)
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return dict()

    def get_all_agents(self, solution_id, user_role=None):
        """
        This function will fetch all the user for a given solution Id
        and return the list of users as response
        :param solution_id: Session Solution ID
        :param user_role: Logged In user role
        :return: List of users as response
        """
        try:
            agents = list()
            user_details = self.us_obj.get_users_list()
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
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return list()

    def specific_queue_info(self, queue_documents, queue_id,
                            queues_name, solution_id):
        """
        This function will process the specific queue documents list
        and return the dictionary as response
        :param queue_documents: list of documents for the specific queue
        :param queue_id: Queue Id
        :param queues_name: List of all queues name
        :param solution_id: Session Solution_id
        :return: dictionary as response
        """
        try:
            if queue_id == 'uncategorized':
                agents = self.get_all_agents(solution_id)
            else:
                agents = self.get_agents_list(int(queue_id), solution_id)
            processing_state = list()
            documents_list_tmp = list()
            for doc in queue_documents:
                processing_state.append(doc['doc_state'])
                if self.role == 'bu':
                    assignee = None
                    if 'life_cycle' in doc \
                            and doc['doc_state'] in doc['life_cycle']:
                        assignee = doc['life_cycle'][doc['doc_state']]['assignee']
                    if assignee == self.user_name or assignee is None:
                        new_doc = update_document_info(doc)
                        documents_list_tmp.append(new_doc)
                else:
                    new_doc = update_document_info(doc)
                    documents_list_tmp.append(new_doc)
            documents_list = documents_list_tmp
            total_documents = len(documents_list)
            sort_by, order_by_asc, skip, limit = \
                get_pagination_details(self.filter_obj, sort_by='created_ts',
                                       order_by_asc=-1, skip=0, limit=0)
            order = True if order_by_asc == -1 else False
            documents_list = sorted(documents_list, key=lambda f: f[sort_by],
                                    reverse=order)
            if total_documents > limit:
                documents_list = documents_list[skip:skip + limit]
            return {'status': 'success', 'documents': documents_list,
                    'agents': agents, 'status_code': STATUS_CODES['OK'],
                    'state': list(set(processing_state)),
                    'total_documents': total_documents,
                    'queue_name': queues_name}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return {'status': 'failure', 'error': str(e),
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Error while retrieving the document '
                           'details information'}

    def overall_queues_info(self, mapped_documents):
        """
        This function will process all queues documents list
        and return the dictionary as response
        :param mapped_documents: list of documents for all queues
        :return: dictionary as response
        """
        try:
            overall_new_count, overall_inprogress_count = 0, 0
            overall_unassigned_count, overall_closed_count = 0, 0
            overall_list = list()
            for case_queue_id in mapped_documents:
                new_unassigned_count, closed_count = 0, 0
                new_count, in_progress_count = 0, 0
                case_queue_dict = mapped_documents[case_queue_id]
                document_list = case_queue_dict['documents']
                case_queue_name = case_queue_dict['queue_name']
                doc_states = list()
                queue_dict = {'queue_id': case_queue_id,
                              'queue_name': case_queue_name['queue_name']}
                for document in document_list:
                    doc_state = document['doc_state']
                    doc_states.append(doc_state)
                    status = 'New'
                    is_assigned = None
                    assignee = None
                    if "life_cycle" in document \
                        and doc_state in document["life_cycle"]:
                        status = document["life_cycle"][doc_state]['status']
                        assignee = document["life_cycle"][doc_state]['assignee']
                        is_assigned = document["life_cycle"][doc_state]['is_assigned']
                    if status == 'New' and is_assigned == None:
                        new_unassigned_count += 1
                        overall_unassigned_count += 1
                    if status == 'In Progress' \
                        and assignee == self.user_name:
                        in_progress_count += 1
                        overall_inprogress_count += 1
                    if status == 'New' \
                            and assignee == self.user_name:
                        new_count += 1
                        overall_new_count += 1
                    if status == 'Closed':
                        closed_count += 1
                        overall_closed_count += 1
                queue_dict.update({'state': list(set(doc_states)),
                                   'in_progress': in_progress_count,
                                   'new': new_count,
                                   'closed': closed_count,
                                   'new_unassigned': new_unassigned_count})
                overall_list.append(queue_dict)
            overall_count = {'overall_new_count': overall_new_count,
                             'overall_inprogress_count': overall_inprogress_count,
                             'overall_closed_count': overall_closed_count,
                             'overall_unassigned_count': overall_unassigned_count}
            return {'status': 'success', 'status_code': STATUS_CODES['OK'],
                    'stats': overall_count, 'queues': overall_list}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return {"status": "failure",
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    "msg": "Error while retrieving the queue information",
                    "error": str(e)}

    def get_user_related_queues(self, solution_id, user_id):
        """
        This function will return the list of queues for which
        logged in user is eligible
        :param solution_id: Session Solution Id
        :param user_id: Session user_id
        :return: list of eligible queues
        """
        try:
            user_details = self.us_obj.get_users_list(user_id=user_id)
            if self.validate_user(user_details, solution_id):
                if user_details['result']['data']:
                    user_data = user_details['result']['data']
                    return self.get_related_queues(user_data, solution_id)
                return []
            return []
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return []

    def get_related_queues(self, user_data, solution_id):
        """
        This function will find all those user groups and queues
        for which this user belongs to
        and return the list of related queues
        :param user_data: User details for which queues info is required
        Here user_data will consists only logged in user details as dict
        :param solution_id: Session solution ID
        :return: list of related queues
        """
        try:
            if 'groups' in user_data and len(user_data['groups']) > 0:
                return self.find_ug_based_queues(user_data['groups'],
                                                 solution_id)
            return []
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return []

    def find_ug_based_queues(self, user_groups, solution_id):
        """
        This function will query the DB and get the list of queues
        in which user group item are present
        and return the list of eligible queues
        :param user_groups: User group info for which user is tagged
        :param solution_id: Session solution id
        :return: list of eligible queues
        """
        try:
            ug_ids = []
            for ug in user_groups:
                ug_ids.append(ug['id'])
            query = {'is_deleted': False, 'solution_id': solution_id}
            projection = {'_id': 0}
            queues = MongoDbConn.find(WORKFLOW_QUEUE_COLLECTION, query,
                                      projection=projection)
            raw_queues = [queue for queue in queues]
            queues_list = []
            for ele in raw_queues:
                if 'user_groups' in ele:
                    for item in ele['user_groups']:
                        if item['id'] in ug_ids:
                            queues_list.append(ele)
                            break
            return queues_list
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return []

    def validate_user(self, user_details, solution_id):
        """
        This function will validate the logged in user details with
        session solution and return the boolean result
        :param user_details: Logged in User details
        :param solution_id: Session Solution Id
        :return: Boolean response
        """
        try:
            if user_details['status_code'] == 200:
                if 'result' in user_details \
                        and 'data' in user_details['result']:
                    user_data = user_details['result']['data']
                    if 'solutions' in user_data:
                        solns = user_data['solutions']
                        for soln in solns:
                            if 'id' in soln and soln['id'] == solution_id:
                                return True
            return False
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return False

    def get_all_documents(self, solution_id):
        """
        This function will fetch the documents from DB
        and return the list of documents records
        :param solution_id: Session solution Id
        :return: list of documents records
        """
        try:
            query = {"solution_id": solution_id,
                     "$or": [{"is_test": False},
                             {"is_test": {"$exists": False}}]}
            projection = {"doc_id": 1, "solution_id": 1, "metadata": 1,
                          "life_cycle": 1, "doc_state": 1, "children": 1,
                          "created_ts": 1, "page_groups": 1,
                          '_id': 0, 'root_id': 1}
            documents = MongoDbConn.find(DOCUMENTS_COLLECTION, query,
                                         projection=projection).\
                sort('_id', -1).limit(int(DOC_COUNT))
            return [doc for doc in documents]
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return []

    def get_rule_dict(self, queues, solution_id):
        """
        This function will fetch the rules for the list of queues
        and return the mapping of queue_id and role
        :param queues: list of queues
        :param solution_id: Session solution id
        :return: mapping of queue_id and role
        """
        try:
            rule_queue_mapper = dict()
            for queue in queues:
                if 'rule_id' in queue and queue['rule_id']:
                    rule = get_rule(solution_id, queue['rule_id'])
                    if rule and 'data' in rule and 'rule' in rule['data']:
                        rule_queue_mapper[queue['case_queue_id']] = rule['data']['rule']
                    else:
                        rule_queue_mapper[queue['case_queue_id']] = dict()
            return rule_queue_mapper
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return dict()

    def map_document_queues(self, solution_id, queues, documents):
        """
        This function will map the documents with queues
        and return the queue dictionary of response
        :param solution_id: Session Solution Id
        :param queues: list of queues
        :param documents: list of documents
        :return: queue dictionary as response
        """
        try:
            queue_data = dict()
            queue_name_uncat = {'queue_name': 'uncategorized queue',
                                'queue_id': 'uncategorized'}
            queue_data['uncategorized'] = {'documents': list(),
                                           'queue_name': queue_name_uncat}
            rules_mapper_dict = self.get_rule_dict(queues, solution_id)
            for queue in queues:
                case_queue_id = queue['id']
                queue_name = {'queue_name': queue['name'],
                              'queue_id': case_queue_id}
                queue_data[case_queue_id] = {'documents': list(),
                                             'queue_name': queue_name}
            for document in documents:
                added = False
                for queue in queues:
                    case_queue_id = queue['id']
                    if 'rule_id' in queue and queue['rule_id']:
                        rule_data = dict()
                        run_type = 'any'
                        if case_queue_id in rules_mapper_dict:
                            rule_data = rules_mapper_dict[case_queue_id]
                            run_type = rule_data['run_type']
                        all_conditions_mapped = False if run_type == 'any' else True
                        if 'conds' in rule_data:
                            for condition in rule_data['conds']:
                                fn = condition['fn'] if 'fn' in condition else 'no_fn'
                                rval = condition['rval'] if 'rval' in condition else ''
                                lval = condition['lval'] if 'lval' in condition else ''
                                op = condition['op'] if 'op' in condition else ''
                                if lval != '' and op != '':
                                    if self.operators[op](self.actions[fn]
                                                              (document[lval]), rval):
                                        if run_type == 'any':
                                            all_conditions_mapped = True
                                    else:
                                        if run_type == 'all':
                                            all_conditions_mapped = False
                        if all_conditions_mapped:
                            queue_data[case_queue_id]['documents'].append(document)
                            added = True
                if not added:
                    queue_data['uncategorized']['documents'].append(document)
            return queue_data
        except Exception as e:
            self.context.log(message=str(e),
                             obj={'tb': traceback.format_exc()})
            return None


if __name__ == '__main__':
    solution_id_test = 'umad3_4f346d43-7228-4b6b-8205-7e2a6373bad9'
    queues_test = [{
    "name" : "q2",
    "id" : '100003',
    "updated_ts" : "2018-08-31T12:09:05.520661",
    "rule_id" : "6f5fcfc2-55af-4862-a42b-aca1143799f7",
    }]
    # rule = {
    #         "rule_id" : "6f5fcfc2-55af-4862-a42b-aca1143799f7",
    #         "solution_id" : "umad3_4f346d43-7228-4b6b-8205-7e2a6373bad9",
    #         "rule" : {
    #             "run_type" : "any",
    #             "conds" : [
    #                 {
    #                     "fn" : "len",
    #                     "rval" : "4",
    #                     "lval" : "metadata",
    #                     "op" : "eq"
    #                 },
    #                 {
    #                     "fn" : "trim",
    #                     "rval" : "76",
    #                     "lval" : "root_id",
    #                     "op" : "lte"
    #                 }
    #             ]
    #         },
    #     }
    query_test = {"solution_id": solution_id_test}
    projection_test = {'_id': 0}
    documents_test = MongoDbConn.find(DOCUMENTS_COLLECTION, query_test,
                                 projection=projection_test).\
        sort('updated_ts', -1).limit(int(DOC_COUNT))
    documents_list_test =  [doc for doc in documents_test]
    qd_map = QueueDocMapper()
    a = qd_map.map_document_queues(solution_id_test, queues_test,
                                   documents_list_test)
    # self.display_to_d_state = {'Needs Classification': 'classified',
    #                             'Post Processing': 'post_processed',
    #                             'Processing': 'processing',
    #                             'Reviewed': 'reviewed',
    #                             'Extraction': 'extracted',
    #                             'Annotation & Entity Linking': 'processed',
    #                             'Error': 'failed'}
