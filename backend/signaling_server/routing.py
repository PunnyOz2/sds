
from django.urls import path
from signaling_server.consumers import SignalingConsumer

websocket_urlpatterns = [
    path('webrtc/signaling/', SignalingConsumer.as_asgi()),
]