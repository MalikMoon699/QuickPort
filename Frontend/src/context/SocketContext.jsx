// Frontend/src/context/SocketContext.jsx
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
      // Ensure this URL matches your deployed backend
      const newSocket = io(
        import.meta.env.VITE_BACKEND_URL ||
          "https://quick-port-backend.vercel.app" ||
          "http://localhost:3000",
        {
          transports: ["websocket", "polling"], 
          withCredentials: true,
        }
      );

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
        console.error("Socket connection error:", error);
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
