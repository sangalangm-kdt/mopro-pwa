import { ReactNode } from "react";
import { WebSocketContext, ServerMessage } from "./WebSocketContext";
import { useWebSocket } from "@/hooks/web-socket"; // ✅ Actual socket logic

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { sendMessage } = useWebSocket<ServerMessage>(
    "ws://localhost:3001",
    (data) => {
      console.log("📩 WebSocket message received:", data);
    }
  );

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
