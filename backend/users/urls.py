from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserView.as_view(), name="user"),
    path('register/',views.user_register,name="register"),
    path('login/', views.user_login, name="login"),
    # path('history/',views.UserHistoryView.as_view(),name='history')
]

