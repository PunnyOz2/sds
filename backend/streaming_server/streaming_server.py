import asyncio
import websockets
import json
import uuid
import logging
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCConfiguration, RTCIceServer
from aiortc.contrib.media import MediaRelay, MediaStreamTrack
# from infer_header import TrtInfer, yuv_to_rgb, rgb_to_yuv, polyp_engine_path, pose_engine_path
# import torch
# from torchvision import transforms
# import torchvision.transforms.functional as F
# from utils.general import non_max_suppression
import time
# from torchaudio.io import StreamReader, StreamWriter
import numpy as np
from av import VideoFrame
import os
import cv2
import sys
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)

class StreamingServer:
    def __init__(self, signaling_server_url, capabilities=None):
        self.signaling_server_url = signaling_server_url
        self.capabilities = capabilities or {}
        self.active_connections = {}  # Store active connections with unique IDs
        self.websocket = None
        self.relay = MediaRelay()  # To relay media streams
        self.server_channel = None  # Store our channel name

        self.configuration = RTCConfiguration(iceServers=[
            RTCIceServer(
                urls=[os.environ.get("STUN_SERVER", "stun:stun.l.google.com:19302")],
                username="user1",
                credential="pass1",
                credentialType="password",
            )
        ])

    async def connect_to_signaling_server(self):
        print("Connecting to signaling server " + self.signaling_server_url)
        try:
            self.websocket = await websockets.connect(self.signaling_server_url)
            
            # Register with the signaling server
            await self.websocket.send(json.dumps({
                'type': 'register_server',
                'capabilities': self.capabilities,
            }))

            # Handle registration response
            response = await self.websocket.recv()
            data = json.loads(response)
            if data['type'] != 'registration_successful':
                raise Exception("Failed to register with signaling server")

            self.server_channel = data['server_channel']
            logging.info(f"Successfully registered with server channel: {self.server_channel}")
            
            # Start message handling loop
            await self.message_handler()

        except Exception as e:
            logging.error(f"Error connecting to signaling server: {e}")
            if self.websocket:
                await self.websocket.close()

    async def message_handler(self):
        print(self.websocket)
        try:
            print("Listening for messages")
            async for message in self.websocket:
                print(message)
                data = json.loads(message)
                print("ok")
                message_type = data.get('type')
                logging.info(f"Received message type: {message_type}")

                if message_type == 'offer':
                    client_channel = data['client_channel']
                    offer_sdp = data['payload']['sdp']
                    offer_type = data['payload']['type']
                    
                    # Process the offer and create an answer
                    answer = await self.handle_offer(offer_sdp, offer_type)

                    # Send the answer back to the signaling server
                    response = {
                        'type': 'answer',
                        'client_channel': client_channel,
                        'payload': {
                            'sdp': answer.sdp,
                            'type': answer.type
                        }
                    }
                    logging.info(f"Sending answer to client: {client_channel}")
                    await self.websocket.send(json.dumps(response))

        except websockets.exceptions.ConnectionClosed:
            logging.error("Connection to signaling server closed")
        except Exception as e:
            logging.error(f"Error in message handler: {e}")

    async def handle_offer(self, offer_sdp, offer_type):
        pc = RTCPeerConnection(configuration=self.configuration)
        #pc = RTCPeerConnection()
        print("PEER_CONNECTION")
        # Store the connection
        connection_id = uuid.uuid4().hex
        self.active_connections[connection_id] = pc

        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            logging.info(f"Connection state is {pc.connectionState}")
            if pc.connectionState == "failed":
                await pc.close()
                del self.active_connections[connection_id]

        @pc.on("track")
        def on_track(track):
            logging.info(f"Track received: {track.kind}")
            if track.kind == "video":
                transformed = VideoTransformTrack(self.relay.subscribe(track))
                pc.addTrack(transformed)

            @track.on("ended")
            async def on_ended():
                logging.info(f"Track ended: {track.kind}")

        # Set the remote description
        print("OFFER_SDP")
        offer = RTCSessionDescription(sdp=offer_sdp, type=offer_type)
        await pc.setRemoteDescription(offer)

        # Create and set the answer
        print("CREATE_ANSWER")
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        print("ANSWER")

        return pc.localDescription

class VideoTransformTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track):
        super().__init__()
        self.track = track
    
    async def recv(self):
        frame = await self.track.recv()
        frame_np = frame.to_ndarray(format="bgr24") 
        
        frame_np = cv2.cvtColor(cv2.Canny(frame_np, 100, 200), cv2.COLOR_GRAY2BGR)

        frame_out = VideoFrame.from_ndarray(frame_np, format="bgr24")
        frame_out.pts = frame.pts
        frame_out.time_base = frame.time_base
        
        return frame_out

async def main():
    load_dotenv(sys.path[1] + '/.env')
    SIGNALING_SERVER_URL = os.getenv("SIGNALING_SERVER_URL", "ws://localhost:5000/webrtc/signaling/")
    
    server = StreamingServer(
        signaling_server_url=SIGNALING_SERVER_URL,
    )
    await server.connect_to_signaling_server()

if __name__ == "__main__":
    asyncio.run(main())
