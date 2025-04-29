"use client";

import { useSocket } from "@/context/SocketContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Interview = ({ role }) => {
  const { socket, ready, setReady } = useSocket();
  const [email, setEmail] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const room = userId;
 
  // Handle joining the room
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room, role });
    },
    [email, room, role, socket]
  );

  // Handle when interviewer/candidate is ready
  const handleReadyButton = useCallback(
    (data) => {
      if (data?.room) {
        setReady(true);
      }
    },
    [setReady]
  );

  // Handle navigation to the room
  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      router.push(`/room/${room}`);
    },
    [router]
  );

  // Emit readiness check only once if candidate
  useEffect(() => {
    if (role === "candidate" && socket) {
      socket.emit("check_ready", { room, socketId: socket.id });
    }
  }, [role, socket, room]);

  // Handle socket connection & events
  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      setIsConnected(true);
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:join", handleJoinRoom);
    socket.on("ready_request", handleReadyButton);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room:join", handleJoinRoom);
      socket.off("ready_request", handleReadyButton);
    };
  }, [socket, handleJoinRoom, handleReadyButton]);

  return (
    <div className="max-w-md mx-auto mt-24 h-screen p-2">
      {/* WebSocket connection status */}
      <div
        className={`text-center text-lg font-semibold ${
          isConnected ? "text-green-500" : "text-red-500"
        }`}
      >
        {isConnected ? "Connected to WebSocket ✅" : "Disconnected ❌"}
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {role === "recruiter" || (role === "candidate" && ready) ? (
          <Button type="submit" className="w-full">
            Submit
          </Button>
        ) : (
          <h1 className="text-xl text-center text-yellow-600">
            Please wait. Your interviewer hasn't joined yet.
          </h1>
        )}
      </form>
    </div>
  );
};

export default Interview;
