from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django.db import IntegrityError
from django.contrib.auth import authenticate,login,logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User
from .serializer import UserSerializer
from utils.responses.response import FormatReponse
from utils.decorators.validator import validate_json_body_func
from utils.validator_models.users import UserRegisterValidation,UserLoginValidation

# Create your views here.
@method_decorator(csrf_exempt,name='dispatch')
class UserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request:Request) -> Response:
        user = request.user
        user_serial = UserSerializer(user)
        return FormatReponse(message='Get current user',data=user_serial.data)
    
    def delete(self,request:Request) -> Response:
        logout(request)
        return FormatReponse(message="Logout success")

@api_view(['POST'])
@csrf_exempt
@validate_json_body_func(UserRegisterValidation)
def user_register(request:Request,body:UserRegisterValidation) -> Response:
    try :
        if body.is_admin :
            user = User.objects.create_superuser(body.username,body.password)
        else :
            user = User.objects.create_user(body.username,body.password)
        user.save()
        user_serial = UserSerializer(user)
        return FormatReponse(message="Register success",data=user_serial.data,status=HTTP_201_CREATED)
    except IntegrityError as e :
        return FormatReponse(message="User exist",status=HTTP_400_BAD_REQUEST)
    except Exception as e:
        return FormatReponse(message="Exception", status=HTTP_400_BAD_REQUEST,data=str(e))



@api_view(['POST'])
@csrf_exempt
@validate_json_body_func(UserLoginValidation)
def user_login(request:Request,body:UserLoginValidation) -> Response :
    user = authenticate(username=body.username,password=body.password)
    if user is not None :
        login(request,user)
        return FormatReponse(message="Login success")
    else :
        return FormatReponse(message='Login failed',status=HTTP_400_BAD_REQUEST)

    





