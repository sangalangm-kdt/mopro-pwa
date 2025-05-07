import { createContext } from "react";

export type ServerMessage = {
  type: string;
  payload?: unknown;
};

export interface WebSocketContextType {
  sendMessage: (msg: ServerMessage) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null
);
