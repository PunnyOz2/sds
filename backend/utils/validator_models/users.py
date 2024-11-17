from pydantic import BaseModel
from pydantic.fields import Required
from pydantic.types import constr

class UserRegisterValidation(BaseModel):
    username:str
    password:constr(min_length=8)
    is_admin:bool

class UserLoginValidation(BaseModel):
    username:str
    password:str