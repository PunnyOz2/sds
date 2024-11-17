import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from collections import defaultdict


logging.basicConfig(level=logging.INFO)

class SignalingConsumer(AsyncWebsocketConsumer):
    streaming_servers = {} 

    async def connect(self):
        logging.info(f"New connection: {self.channel_name}")
        await self.accept()
        
    async def disconnect(self, close_code):
        logging.info(f"Disconnected: {self.channel_name}")
        if self.channel_name in self.streaming_servers:
            del self.streaming_servers[self.channel_name]

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data['type']
            
            if message_type == 'register_server':
                server_info = {
                    'channel_name': self.channel_name,
                    'capabilities': data.get('capabilities', {}),
                }

                self.streaming_servers[self.channel_name] = server_info
                await self.send(json.dumps({
                    'type': 'registration_successful',
                    'server_channel': self.channel_name
                }))

            elif message_type == 'offer': # from clients
                selected_server = await self.select_server()
                if not selected_server:
                    await self.send(json.dumps({
                        'type': 'error',
                        'message': 'No available streaming servers'
                    }))
                    return

                channel_layer = get_channel_layer()
                logging.info(f"Selected server: {selected_server}")
                # Send to channel layer
                await channel_layer.send(
                    selected_server,
                    {
                        'type': 'channel_relay',  # Changed to generic relay type
                        'message': {
                            'type': 'offer',
                            'payload': data['payload'],
                            'client_channel': self.channel_name,
                        }
                    }
                )

            elif message_type == 'answer': # from servers
                client_channel = data['client_channel']
                if client_channel:
                    channel_layer = get_channel_layer()
                    await channel_layer.send(
                        client_channel,
                        {
                            'type': 'channel_relay', 
                            'message': {
                                'type': 'answer', 
                                'payload': data['payload'],
                            }
                        }
                    )

        except json.JSONDecodeError:
            await self.send(json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))

    async def channel_relay(self, event):
        """Relay messages between clients and servers"""
        logging.info(event)
        await self.send(text_data=json.dumps(event['message']))

    async def select_server(self):
        if not self.streaming_servers:
            return None
            
        # return first available server
        selected_server = list(self.streaming_servers.keys())[0]
        return selected_server