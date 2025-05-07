import { useEffect, useRef, useCallback } from "react";

export interface ServerMessage {
  type: string;
  payload?: unknown;
}

export const useWebSocket = <T extends ServerMessage>(
  url: string,
  onMessage: (data: T) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (event) => {
      try {
        const data: T = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("❌ Error parsing WebSocket message", err);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket closed");

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  // ✅ Safe sendMessage helper with T type
  const sendMessage = useCallback((msg: T) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket is not open, cannot send message");
    }
  }, []);

  return { sendMessage };
};
