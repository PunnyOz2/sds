import {
  Text,
  Box,
  Button,
  IconButton,
  Icon,
  Input,
  StepSeparator,
  Divider,
  Flex,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import StreamingOverlayMenu from "../components/StreamingOverlayMenu";
import { MdFullscreen } from "react-icons/md";
import useFullscreenStore from "../stores/fullscreenStore";

const Streaming: React.FC = () => {
  const localHTMLVideoRef = useRef<HTMLVideoElement>(null); // Reference to local video element
  const remoteHTMLVideoRef = useRef<HTMLVideoElement>(null); // Reference to remote video element
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null); // Reference to WebRTC peer connection
  const socketRef = useRef<WebSocket | null>(null); // Reference to WebSocket connection
  const localMediaStreamRef = useRef<MediaStream | null>(null); // Reference to local media stream (for example, webcam or video upload)

  const [isStreamActive, setIsStreamActive] = useState(false);

  const [frameRate, setFrameRate] = useState(0);

  const remoteStreamingBoxRef = useRef<HTMLDivElement>(null);

  const { isFullscreen, setScreenRef, toggleFullscreen } = useFullscreenStore();

  const inputVideoFileFormRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");

  // isClient is to check if browser is running client code
  // We wont't display video until client code is running
  // To prevent Error: Hydration failed because the initial UI does not match what was rendered on the server.
  // It's Next.js thing, I don't know much about it
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set remote streaming box reference to fullscreen store
  useEffect(() => {
    setScreenRef(remoteStreamingBoxRef.current);
  }, [isClient]);

  const startStream = async (stream: MediaStream) => {
    localMediaStreamRef.current = stream;

    if (localHTMLVideoRef.current) {
      localHTMLVideoRef.current.srcObject = stream;
    }

    setIsStreamActive(true);
    initializeWebSocket();
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      await startStream(stream);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const startVideoStream = async () => {
    if (!videoFile) return;

    setVideoSrc(URL.createObjectURL(videoFile));

    const stream = await new Promise<MediaStream>((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(videoFile);
      videoElement.onloadedmetadata = () => {
        videoElement.play().then(() => {
          const stream = (videoElement as any).captureStream();
          resolve(stream);
        });
      };
    });

    await startStream(stream);
  };

  const stopStream = () => {
    if (localMediaStreamRef.current) {
      localMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      localMediaStreamRef.current = null;
    }

    if (localHTMLVideoRef.current) {
      localHTMLVideoRef.current.srcObject = null;
      localHTMLVideoRef.current.src = "";
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsStreamActive(false);

    setVideoSrc("");
    setVideoFile(null);
    inputVideoFileFormRef.current!.value = "";
  };

  const startPeerConnection = async () => {
    if (!localMediaStreamRef.current || !socketRef.current) return;

    const configuration: RTCConfiguration = {
      iceServers: [
        // { urls: `${process.env.NEXT_PUBLIC_STUNNER_URL}` },
        { urls: `${process.env.NEXT_PUBLIC_STUNNER_URL}`,
          username: 'user1',
          credential: 'pass1'
        },
      ],
    };
    
    
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Conneting to remote peer
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "candidate", payload: event.candidate })
        );
      }
    };

    peerConnectionRef.current.onconnectionstatechange = () => {
      if (peerConnectionRef.current?.connectionState === "connected") {
        console.log("WebRTC connection established");
      } 
    };

    // Receive remote stream track from remote peer and display it in remote HTML video element
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteHTMLVideoRef.current) {
        console.log("Received remote stream:", event.streams[0]);
        remoteHTMLVideoRef.current.srcObject = event.streams[0];
      }
    };

    localMediaStreamRef.current.getTracks().forEach((track) => {
      if (peerConnectionRef.current) {
        // Send local stream track to remote peer
        peerConnectionRef.current.addTrack(track, localMediaStreamRef.current!);
      }
    });

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.send(JSON.stringify({ type: "offer", payload: offer }));
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const initializeWebSocket = () => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL!);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(
        "WebSocket connection established and starting peer connection"
      );

      startPeerConnection();
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      console.log("Received WebSocket message:", data);
      if (!peerConnectionRef.current) return;

      try {
        if (data.type === "offer") {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.payload)
          );

          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.send(JSON.stringify({ type: "answer", payload: answer }));
        } else if (data.type === "answer") {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.payload)
          );
        } else if (data.type === "candidate") {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.payload)
          );
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };
  };

  async function getWebRTCStats() {
    if (!peerConnectionRef.current) return;

    const stats = await peerConnectionRef.current.getStats();
    stats.forEach((report) => {
      if (report.type === "inbound-rtp" && report.kind === "video") {
        setFrameRate(report.framesPerSecond || 0);
      }
    });
  }

  useEffect(() => {
    if (isStreamActive) {
      const interval = setInterval(() => {
        getWebRTCStats();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStreamActive]);

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      {isClient && (
        <>
          <Flex justifyContent="center" alignItems="center" gap="2">
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="x-large" as="b">
                Local
              </Text>
              <video
                ref={localHTMLVideoRef}
                autoPlay
                playsInline
                controls
                muted
                style={
                  isFullscreen
                    ? { background: "black", height: "100vh" }
                    : { background: "black", height: "40vh", width: "40vw" }
                }
              />
            </Flex>

            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="x-large" as="b">
                Remote
              </Text>
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                ref={remoteStreamingBoxRef}
                position="relative"
                bg="black"
              >
                <StreamingOverlayMenu />

                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  p={2}
                  bg="black"
                  color="white"
                >
                  {frameRate} fps
                </Box>

                <IconButton
                  position="absolute"
                  bottom={0}
                  right={0}
                  icon={<MdFullscreen />}
                  onClick={() => toggleFullscreen()}
                  colorScheme="white"
                  aria-label="Toggle fullscreen"
                  size="lg"
                  fontSize={isFullscreen ? "4xl" : "2xl"}
                  zIndex={99}
                />

                <video
                  ref={remoteHTMLVideoRef}
                  autoPlay
                  playsInline
                  // controls
                  muted
                  style={
                    isFullscreen
                      ? { height: "100vh" }
                      : { height: "40vh", width: "40vw" }
                  }
                />
              </Flex>
            </Flex>
          </Flex>

          <Divider my={4} />

          <Box>
            <Button
              onClick={isStreamActive ? stopStream : startWebcam}
              colorScheme={isStreamActive ? "red" : "green"}
              mr={2}
            >
              {isStreamActive ? "Stop Webcam" : "Start Webcam"}
            </Button>
          </Box>

          <Divider my={4} />

          <HStack gap={2}>
            <Input
              ref={inputVideoFileFormRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setVideoFile(e.target.files[0]);
                }
              }}
              display="block"
            />

            <Button
              onClick={videoSrc ? stopStream : startVideoStream}
              colorScheme={videoSrc ? "red" : "blue"} // Change color based on video status
              isDisabled={!videoFile && !isStreamActive} // Disable if no video is selected
            >
              {isStreamActive ? "Stop Video" : "Start Video"}
            </Button>
          </HStack>
        </>
      )}
    </Flex>
  );
};

export default Streaming;
