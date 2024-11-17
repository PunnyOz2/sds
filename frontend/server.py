"
import asyncio
import json
import logging
import websockets
from aiortc import RTCPeerConnection, RTCSessionDescription, MediaStreamTrack, VideoStreamTrack, RTCIceCandidate
from aiortc.contrib.media import MediaRelay

logging.basicConfig(level=logging.INFO)

# Store peer connections
pcs = set()
relay = MediaRelay()

class VideoTransformTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track):
        super().__init__()
        self.track = track

    async def recv(self):
        frame = await self.track.recv()
        return frame

async def handle_offer(websocket, params):
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        logging.info(f"Connection state is {pc.connectionState}")
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    @pc.on("track")
    def on_track(track):
        logging.info(f"Track received: {track.kind}")
        if track.kind == "video":
            transformed = VideoTransformTrack(relay.subscribe(track))
            pc.addTrack(transformed)
        
        @track.on("ended")
        async def on_ended():
            logging.info(f"Track ended: {track.kind}")

    # Set the remote description
    await pc.setRemoteDescription(offer)

    # Create and send answer
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return pc.localDescription



async def handler(websocket, path):
    pc = None
    try:
        logging.info(f"Client connected: {websocket.remote_address}")
        
        async for message in websocket:
            try:
                data = json.loads(message)
                logging.info(f"Received message type: {data['type']}")

                if data["type"] == "offer":
                    response = await handle_offer(websocket, data["payload"])
                    await websocket.send(json.dumps({
                        "type": "answer",
                        "payload": {
                            "sdp": response.sdp,
                            "type": response.type
                        }
                    }))

            except Exception as e:
                logging.error(f"Error handling message: {e}")

    except websockets.exceptions.ConnectionClosed:
        logging.info(f"Client disconnected: {websocket.remote_address}")
    finally:
        if pc:
            await pc.close()
            pcs.discard(pc)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 6789):
        logging.info("Server started on ws://0.0.0.0:6789")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
"