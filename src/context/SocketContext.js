"use client"; // Required in Next.js for client-side execution

import { createContext, useContext, useMemo, useState } from "react";
import { io } from "socket.io-client";

// Create a WebSocket Context
const SocketContext = createContext(null);

// Hook to use the socket in components
export const useSocket = () => {
    return useContext(SocketContext);
};

// WebSocket Provider
export const SocketProvider = ({ children }) => {
     const [ready, setReady] = useState(false);
    // Initialize the socket connection once
    // const socket = useMemo(() => io(process.env.NEXT_PUBLIC_VideoCallServer_URL), []); 
    const socket = useMemo(() => {
        const URL = process.env.NEXT_PUBLIC_VideoCallServer_URL;
        console.log("Connecting to socket server at:", URL);
        return io(URL, {
          transports: ["websocket"],
          withCredentials: true,
        });
      }, []);
    return (
        <SocketContext.Provider value={{socket,ready,setReady}}>
            {children}
        </SocketContext.Provider>
    );
};
