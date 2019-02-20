"""
@author: Rohit Kumar Jaju
@date: September 12, 2018
@purpose: The functions mentioned in this python class are responsible
          for all kind of User Group related CRUD operations,
          assigning user to an existing user group,
          detaching an user from an user group and defining user roles.
          All functions are exposed as APIs.
"""

import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, STATUS_CODES, KEY_CLOAK_API_URI, \
    KEY_CLOAK_USER_GROUPS_ENDPOINT, KEY_CLOAK_USER_ROLES_ENDPOINT, \
    KEY_CLOAK_USERS_ENDPOINT
from services.solutions import solution_request, SolutionService
from utilities.http import get as http_get, post as http_post, \
    delete as http_delete, put as http_put


class UserServices:
    """
    The functions mentioned in this python class are responsible
    for all kind of User Group related CRUD operations,
    assigning user to an existing user group,
    detaching an user from an user group and defining user roles.
    All functions are exposed as APIs.
    """

    def __init__(self):
        """
        This is constructor for the UserService class.
        It is responsible for creating the logger object.
        """
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)
        self.auth_header = 'Bearer'

    def get_user_groups(self, user_group_id):
        """
        This function will hit the key_cloak api to get
        the list of user groups and return the response
        fetched for the key_cloak api
        :param user_group_id: Id of an existing user_group
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            if user_group_id:
                url += '/' + user_group_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_get(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to fetch user groups',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process get user group request.'}

    def create_user_groups(self, payload):
        """
        This function will hit the key_cloak api to create the user group
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user group',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process create user group request.'}

    def update_user_groups(self, payload):
        """
        This function will hit the key_cloak api to update the user group
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            url += '/' + payload['id']
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_put(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to update user group',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process update user group request.'}

    def create_nested_groups(self, payload, user_group_id):
        """
        This function will create the user subgroup in existing user_group
        and return the dictionary as response
        :param payload: Http request payload
        :param user_group_id: Existing user group Id
        :return: dictionary as response
        """
        try:
            if not user_group_id:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['PRECONDITION_REQUIRED'],
                        'msg': 'user group id is missing in request url.'}
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user group',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process create user group request.'}

    def process_user_groups_request(self, request, user_group_id=None):
        """
        This function is responsible for handling all requests related
        to user group and return the dictionary as response
        :param request: Http request
        :param user_group_id: Id of an existing user_group
        :return: dictionary as response
        """
        try:
            self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
            if request.method == 'GET':
                return self.get_user_groups(user_group_id)
            elif request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                path = request.get_full_path()
                if 'nestedusergroups' in path and user_group_id:
                    return self.create_nested_groups(payload, user_group_id)
                if 'id' in payload and payload['id'] and \
                        payload['id'].strip():
                    return self.update_user_groups(payload)
                if 'parentId' in payload and payload['parentId'] and \
                        payload['parentId'].strip():
                    return self.update_user_groups(payload)
                return self.create_user_groups(payload)
            elif request.method == 'DELETE':
                return self.delete_user_group(user_group_id)
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process user group request.'}
        finally:
            self.context.end_span()

    def process_user_roles_request(self, request, role_id=None, user_id=None):
        """
        This function is responsible for handling all requests related
        to user roles and return the dictionary as response
        :param request: Http request
        :param role_id: Id of user role
        :param user_id: user Id
        :return: dictionary as response
        """
        try:
            self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
            if request.method == 'GET':
                if role_id:
                    return self.get_user_role_id(role_id)
                return self.get_user_roles()
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'id' in payload and payload['id'] and \
                        payload['id'].strip():
                    return self.update_user_roles(payload)
                return self.create_user_roles(payload)
            if request.method == 'DELETE':
                if user_id:
                    return self.delete_user_from_role(role_id, user_id)
                return self.delete_user_role(role_id)
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process user roles request.'}
        finally:
            self.context.end_span()

    def delete_user_role(self, role_id):
        """
        This function will delete the user role and
        return the dictionary as response
        :param role_id: user role to be deleted
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            url += '/' + role_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_delete(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to delete user role',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process delete user role request.'}

    def delete_user_from_role(self, role_id, user_id):
        """
        This function will hit the key_cloak api to delete a user from role
        and return the response fetched for the key_cloak api
        :param role_id: role Id
        :param user_id: user Id
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            url += '/' + role_id + '/users/' + user_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_delete(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to remove user from role',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process update user role request.'}

    def update_user_roles(self, payload):
        """
        This function will hit the key_cloak api to update the user roles
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            url += '/' + payload['id']
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_put(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to update user role',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process update user role request.'}

    def create_user_roles(self, payload):
        """
        This function will hit the key_cloak api to create the user roles
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user roles',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process create user roles request.'}

    def get_user_roles(self):
        """
        This function will fetch the User roles
        and return the dictionary as response
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_get(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to fetch user roles',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process get user roles request.'}

    def get_user_role_id(self, role_id):
        """
        This function will fetch the User role by id
        and return the dictionary as response
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            url += '/' + role_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_get(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to fetch user roles',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process get user roles request.'}

    def delete_user_group(self, user_group_id):
        """
        This function will delete the user group and
        return the dictionary as response
        :param user_group_id: user group to be deleted
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            url += '/' + user_group_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_delete(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to delete user group',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process delete user group request.'}

    def process_user_request(self, request, user_id=None):
        """
        This function will process the http request
        and implement the all user CRUD APIs
        and return the dictionary as response
        :param request: Http request to be processed
        :param user_id: ID of user which needs to be deleted
        :return: dictionary as response
        """
        try:
            self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
            if request.method == 'GET':
                return self.get_users_list(user_id)
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'id' in payload and payload['id'] and \
                        payload['id'].strip():
                    return self.update_user(payload)
                return self.create_users(payload)
            if request.method == 'DELETE':
                return self.delete_user(user_id)
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process user request.'}
        finally:
            self.context.end_span()

    def update_user(self, payload):
        """
        This function will hit the key_cloak api to update the user
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USERS_ENDPOINT
            url += '/' + payload['id']
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_put(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to update user',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process update user request.'}

    def delete_user(self, user_id):
        """
        This function will delete the user from the DB
        and return the dictionary as response
        :param user_id: Id of the user to be deleted
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USERS_ENDPOINT
            url += '/' + user_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_delete(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to delete user',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process delete user request.'}

    def get_users_list(self, user_id=None):
        """
        This function will fetch the existing users list
        and return the dictionary as response
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USERS_ENDPOINT
            if user_id:
                url += '/' + user_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_get(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to fetch users list',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process get users request.'}

    def create_users(self, payload):
        """
        This function will hit the key_cloak api to create the users
        and return the response fetched for the key_cloak api
        :param payload: Http request payload
        :return: response fetched from the key_cloak api
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USERS_ENDPOINT
            data_dict = payload
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, data_dict, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process create user request.'}

    def process_users_linking_request(self, request, ug_id=None, user_id=None):
        """
        This function will link the user/users to an existing user group,
        unlink the existing user from an user group
        and return the dictionary as response
        :param request: Http request to be processed
        :param ug_id: user_group ID
        :param user_id: user_id
        :return: dictionary as response
        """
        try:
            self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                return self.link_users_usergroups(payload)
            elif request.method == 'DELETE':
                if ug_id and user_id:
                    return self.delete_user_user_group_link(ug_id, user_id)
                else:
                    return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                            'msg': 'user_group_id and user_id parameters are '
                                   'missing in payload',
                            'status': 'Failure'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process user group request.'}
        finally:
            self.context.end_span()

    def delete_user_user_group_link(self, ug_id, user_id):
        """
        This function will remove the linking between existing user
        and existing user group and return the dictionary as response
        :param ug_id: User group ID
        :param user_id: User ID
        :return: dictionary as response
        """
        try:
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            url += '/' + ug_id + '/' + KEY_CLOAK_USERS_ENDPOINT
            url += '/' + user_id
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_delete(url, headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to detach user from user group',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process delete user group request.'}

    def link_users_usergroups(self, payload):
        """
        This function will hit the key_cloak api to link the user/users
        :param payload: Http request payload
        :return: dictionary as response
        """
        try:
            if 'userIds' not in payload:
                return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'user_ids parameter missing in payload',
                        'status': 'Failure'}
            if 'groupId' not in payload:
                return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'user_group_id parameter missing in payload',
                        'status': 'Failure'}
            user_group = payload['groupId']
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_GROUPS_ENDPOINT
            url += '/' + user_group + '/' + KEY_CLOAK_USERS_ENDPOINT
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, payload['userIds'], headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process link user/users request.'}

    def process_user_solutions(self, request):
        """
        :param request: Http request
        :return: list of solutions as response
        """
        sol_resp = []
        logged_in_user = request.session.get('user', None)
        if logged_in_user:
            self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
            user_solutions_from_session = logged_in_user.get('solutions', [])
            for user_solution in user_solutions_from_session:
                sol = SolutionService.get_solution(solution_name=user_solution.get('name'))
                if sol:
                    sol_resp.append({"solution_id": sol['solution_id'],
                                     "solution_name": sol['solution_name'],
                                     "solution_type": sol['solution_type'],
                                     "description": sol['description'],
                                     "timestamp": sol['updated_ts']})
        return sol_resp

    def process_users_linking_roles_request(self, request, ug_id=None, role_id=None):
        """
        This function will link the user/users to an existing user role,
        unlink the existing user from an user rle
        and return the dictionary as response
        :param request: Http request to be processed
        :param ug_id: user_role ID
        :param role_id: role_id
        :return: dictionary as response
        """
        try:
            if request.method == 'POST':
                try:
                    self.auth_header += ' ' + request.META['HTTP_AUTHORIZATION']
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                return self.link_users_userroles(payload)
            # elif request.method == 'DELETE':
            #     if ug_id and role_id:
            #         return self.delete_user_user_role_link(ug_id, role_id)
            #     else:
            #         return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
            #                 'msg': 'user_role_id and user_id parameters are '
            #                        'missing in payload',
            #                 'status': 'Failure'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process user role request.'}
        finally:
            self.context.end_span()

    def link_users_userroles(self, payload):
        """
        This function will hit the key_cloak api to link the user/users
        :param payload: Http request payload
        :return: dictionary as response
        """
        try:
            if 'userIds' not in payload:
                return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'user_ids parameter missing in payload',
                        'status': 'Failure'}
            if 'roleId' not in payload:
                return {'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'roleId parameter missing in payload',
                        'status': 'Failure'}
            user_role = payload['roleId']
            url = KEY_CLOAK_API_URI + KEY_CLOAK_USER_ROLES_ENDPOINT
            url += '/' + user_role + '/' + KEY_CLOAK_USERS_ENDPOINT
            headers = {'Content-Type': 'application/json',
                       'Accept': '*/*',
                       'Authorization': self.auth_header}
            resp = http_post(url, payload['userIds'], headers1=headers)
            if not resp or int(resp['status_code']) != 200:
                return {'status_code': int(resp['status_code']),
                        'msg': 'not able to create user',
                        'status': 'Failure'}
            resp['msg'] = resp['result']['message']
            return resp
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process link user/users request.'}
