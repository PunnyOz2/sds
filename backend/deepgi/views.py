from rest_framework.views import APIView
from rest_framework.request import Request

from utils.responses.response import FormatReponse
class HelloView(APIView):
    def get(self,request:Request):
        return FormatReponse(message="Hello")