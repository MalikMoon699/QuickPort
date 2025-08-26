import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData) {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "https://quick-port-backend.vercel.app";
      const newSocket = io(backendUrl, {
        transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server with ID:", newSocket.id);
        if (userData.role === "driver") {
          newSocket.emit("join-room", userData._id, userData.role);
          console.log("Driver joined room:", `driver-${userData._id}`);
        } else {
          newSocket.emit("join-room", userData._id, userData.role);
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
