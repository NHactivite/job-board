"use client"

import { Mic, PhoneOff, Video } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from "../../context/SocketContext"
import peer from "../../services/peer"

const  VideoPage = ({role}) => {
  const params = useParams()
  const room = params.room
  
    const {socket}=useSocket();
    const router=useRouter();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)  

    const handleUserJoined = useCallback(({id}) => {
      
        setRemoteSocketId(id);
      }, []);
    
      const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const offer = await peer.getOffer();       
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
      }, [remoteSocketId, socket]);
    
      const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
          setRemoteSocketId(from);
          
          const stream = await navigator.mediaDevices.getUserMedia({
            // audio: true,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
          
            video: true,
          });
          setMyStream(stream);
          const ans = await peer.getAnswer(offer);
          socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
      );
    
      const toggleVideo = useCallback(() => {
        if (myStream) {
          myStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled; // Toggle video on/off
          });
        }
      }, [myStream]);
      
    const sendStreams = useCallback(() => {
        if (!peer || !peer.peer) return; // Ensure peer connection exists
     
        myStream.getTracks().forEach((track) => {
          const existingSender = peer.peer.getSenders().find((s) => s.track === track);
          if (!existingSender) {
            peer.peer.addTrack(track, myStream);
          }
        });
       
      }, [myStream, remoteStream, peer]);
      
      console.log("remoteStream outside",remoteStream);
      const handleCallAccepted = useCallback(
        ({ from, ans }) => {
          peer.setLocalDescription(ans);
          sendStreams();
        },
        [sendStreams]
      );
    
      const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      }, [remoteSocketId, socket]);
    
    useEffect(() => {
        if (!peer || !peer.peer) return;
      
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
      
        return () => {
          if (peer.peer) {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
          }
        };
      }, [handleNegoNeeded, peer]);
      
    
      const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
          const ans = await peer.getAnswer(offer);
          socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket,remoteSocketId]
      );
    
      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
      }, []);
    
      const handleDisconnect = useCallback(() => {
        // Close the WebRTC connection
        peer.closeConnection();
      
        // Stop all local media tracks
        if (myStream) {
          myStream.getTracks().forEach(track => track.stop());
          setMyStream(null);
        }
      
        // Stop all remote media tracks
        if (remoteStream) {
          remoteStream.getTracks().forEach(track => track.stop());
          setRemoteStream(null);
        }
      
        // Notify the remote peer about disconnection
        if (remoteSocketId) {
          socket.emit("user:disconnect", { to: remoteSocketId,room});
        }{
          socket.emit("single_disconnect", { room});
        }
      
        // Reset the remote socket ID
        setRemoteSocketId(null);
        router.push("/")
      }, [myStream, remoteStream, remoteSocketId, socket]);
      
    
      useEffect(() => {
        // Check if peer and peer.peer exist before trying to use them
        if (peer && peer.peer) {
          peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream[0]);
          });
          
          // Add cleanup function
          return () => {
            if (peer && peer.peer) {
              peer.peer.removeEventListener("track", () => {});
            }
          };
        }
      }, []); // Add peer as a dependency
  useEffect(() => {

    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("user:disconnected", handleDisconnect);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:disconnected", handleDisconnect);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  
  return (
    <div className="flex flex-col items-center w-full h-screen  text-white rounded-md px-4">
    <div className="flex justify-between items-center w-full h-12 bg-gray-800 px-4 rounded-md">
      {/* <h1 className="text-lg font-semibold">Room Page</h1> */}
      <h4>{remoteSocketId ? "Connected" : "wait to join"}</h4>
      {myStream && (
        <button onClick={sendStreams} className="px-4 py-1 bg-blue-500 rounded-md">Send Stream</button>
      )}
      {remoteSocketId && role === "recruiter" && (
        <button onClick={handleCallUser} className="px-4 py-1 bg-green-500 rounded-md">CALL</button>
      )}
    </div>
    <div className="relative h-screen w-full max-w-5xl aspect-video bg-black mt-4 rounded-lg overflow-hidden">
      {remoteStream && (
        <ReactPlayer playing   height="100%" width="100%" url={remoteStream}/>
      )}
      <div className="absolute bottom-4 right-4 w-32 aspect-video border border-white/20 rounded-lg overflow-hidden">
        {myStream && (
          <ReactPlayer playing muted={isMuted} height="100%" width="100%" url={myStream}/>
        )}
      </div>
    </div>

    {/* <div className="flex items-center justify-between w-full max-w-lg mt-4 p-3 bg-gray-800 rounded-full">
   */}
      <div className="flex justify-around gap-3 w-full max-w-lg mt-4 p-3 bg-gray-800 rounded-full">
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-full ${isMuted ? "bg-red-500" : "bg-gray-700"}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          className={`w-10 h-10 flex items-center justify-center rounded-full ${!isVideoOff ? "bg-gray-700" : "bg-red-500"}`}
          onClick={() => {
            setIsVideoOff(!isVideoOff);
            toggleVideo();
          }}
        >
          <Video className="w-5 h-5" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500" onClick={handleDisconnect}>
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
   
  </div>
  )
}

export default  VideoPage

