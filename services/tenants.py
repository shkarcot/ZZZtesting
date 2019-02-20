import traceback
from uuid import uuid4

from django.http.response import JsonResponse
import json

from xpms_common import trace

from config_vars import SERVICE_NAME

tracer = trace.Tracer.get_instance(SERVICE_NAME)


#TODO need to fix get call functionality
def tenants_active(request):
    if request.method == 'POST':
        payload = json.loads(request.body.decode())
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            solution_id = payload["solution_id"]
            request.session['solution_id'] = solution_id
            resp = {"status": "success", "msg": "Solution Id assigned to session"}
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            resp = {"status": "failure", "msg": "Failed to update session ","error":str(e)}
        context.end_span()
        return JsonResponse(resp)