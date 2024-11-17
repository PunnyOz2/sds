from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK


def FormatReponse(message="OK", data=None, status=HTTP_200_OK):
    body = {}
    body['message'] = message
    if data is not None:
        body['data'] = data
    return Response(body, status=status)
