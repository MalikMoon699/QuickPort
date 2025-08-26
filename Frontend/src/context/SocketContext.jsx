import { io } from "socket.io-client";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData) {
      // For Vercel deployment
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const isVercel = backendUrl.includes("vercel.app");

      const newSocket = io(isVercel ? backendUrl : backendUrl, {
        path: isVercel ? "/api/socket.io" : "",
        transports: ["polling", "websocket"],
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
        console.error("Connection error:", error);
        // Fallback to polling if websockets fail
        newSocket.io.opts.transports = ["polling", "websocket"];
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
