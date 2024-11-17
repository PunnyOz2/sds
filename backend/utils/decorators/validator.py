from typing import Type
from pydantic import BaseModel, ValidationError
from rest_framework.request import Request
from rest_framework.status import HTTP_400_BAD_REQUEST
from ..responses.response import FormatReponse

def validate_json_body(model: Type[BaseModel], body_name='body'):
    def validate_method(method):
        def validate_method(self,request:Request,*args,**kwargs):
            if request.headers['Content-Type'] != 'application/json':
                return FormatReponse(status=HTTP_400_BAD_REQUEST,message='expect JSON format')
            try:
                validated_body = model.parse_obj(request.data)
            except ValidationError as e:
                return FormatReponse(status=HTTP_400_BAD_REQUEST,message='validation error',data=e.errors())
            kwargs.update({
                body_name: validated_body
            })
            return method(self,request,*args,**kwargs)
        return validate_method
    return validate_method

def validate_json_body_func(model: Type[BaseModel], body_name='body'):
    def validate_method(method):
        def validate_method(request:Request,*args,**kwargs):
            if request.headers['Content-Type'] != 'application/json':
                return FormatReponse(status=HTTP_400_BAD_REQUEST,message='expect JSON format')
            try:
                validated_body = model.parse_obj(request.data)
            except ValidationError as e:
                return FormatReponse(status=HTTP_400_BAD_REQUEST,message='validation error',data=e.errors())
            kwargs.update({
                body_name: validated_body
            })
            return method(request,*args,**kwargs)
        return validate_method
    return validate_method