import traceback
from uuid import uuid4

from django.template.response import TemplateResponse
from django.contrib.auth import logout
from django.http.response import HttpResponseRedirect, HttpResponseForbidden
from xpms_common import trace

#from api.models import  SolutionUser
#from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse

from config_vars import SERVICE_NAME
from xc.keycloak_service import KeycloakService

tracer = trace.Tracer.get_instance(SERVICE_NAME)

FOLDER_MAPS = {"se": "platform", "bu": "ref-app", "sa": "uam",
               "sv": "ref-app"}


def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/")


def get_user_info(request):
    data = dict()
    data['sess_id'] = "FAKE_SESSION"
    data['logged_in'] = False
    data["user"] = {"solution_name": ""}
    user = None
    role = "sa"
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        # user = User.objects.get(username=request.user.username)

        access_token = request.META.get('HTTP_AUTHORIZATION', b'')
        if access_token:
            user = KeycloakService.get_logged_in_user_info_from_request(access_token)
            if user:
                return user
            else:
                raise PermissionError
        else:
            print("User In session >>>")
            print(request.session.get('user',None))
            user = request.session.get('user',None)

    # TODO raise specific exception
    except Exception as e:
        print(str(e))

    if user:
        data['logged_in'] = True
        context1 = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context1.start_span(component=__name__)
        try:
            #TODO remove this
            # get_solution_user = SolutionUser.objects.get(solution_user__username=request.user.username)
            # role = get_solution_user.user_type
            return user
        # TODO raise specific exception

        except Exception as e:
            context1.log(message=str(e), obj={"tb": traceback.format_exc()})
        finally:
            context1.end_span()
    context.end_span()
    data['role'] = role
    data['username'] = request.user.username
    return data


def get_user_state(request):
    return JsonResponse(get_user_info(request))


def home(request):
    data = get_user_info(request)
    if data['role'] and data['role'] in ["bu", "se", "sa", "sv"]:
        template_url = FOLDER_MAPS[data['role']] + "/index.html"
        return TemplateResponse(request, template_url, context={"session_token": "New Session"})
    else:
        return HttpResponseForbidden()


def generic_views(request, html_name):
    return TemplateResponse(request, "views/"+html_name,
                            {"dollar_index": "{{$index}}",
                             "name": "Sandeep"})