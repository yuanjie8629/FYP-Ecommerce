from urllib import request
from wsgiref.util import request_uri
from rest_framework.views import exception_handler
from django.dispatch import receiver
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

def enforce_csrf(request):
    check = CSRFCheck(request)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied("CSRF Failed: %s" % reason)


def show_debug_toolbar_in_staging(*args, **kwargs):
    return True


def dict_to_querydict(dictionary):
    from django.http import QueryDict
    from django.utils.datastructures import MultiValueDict

    qdict = QueryDict("", mutable=True)

    for key, value in dictionary.items():
        d = {key: value}
        qdict.update(MultiValueDict(d) if isinstance(value, list) else d)

    return qdict


def update_request_data(request, data):
    if hasattr(request.data, "_mutable"):
        request.data._mutable = True
    request.data.clear()
    request.data.update(data)
    if hasattr(request.data, "_mutable"):
        request.data._mutable = False
    return request


def split_date(date):
    return date.split("-")
