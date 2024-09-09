"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const WebSocketCtx = createContext<{
  sendObject: <T>(obj: T) => boolean;
  getReceived: <T>() => T[];
  getApprouved: <T>() => T[];
  removeObject: <T>(obj: T) => boolean;
} | null>(null);

export const WsProvider: React.FC<{
  uri: string;
  mapper: (obj: any) => any[];
  children: React.ReactNode;
}> = ({ uri, mapper, children }) => {
  const receivedRef = useRef<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:4000" + uri);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    wsRef.current.onerror = (e) => {
      console.log("WebSocket error : ", e);
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket closed. Reconnecting...');
    };



    wsRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("data : ", data);
      if (data) {
        if (Array.isArray(data)) {
          receivedRef.current = mapper(data);
        } else {
          receivedRef.current = [...receivedRef.current, ...mapper(data)];
        }
      }
    };
    
  }, [uri, mapper]);

  // Permet d'amener une notification
  const sendObject = useCallback((obj: any): boolean => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
      return true;
    }
    return false;
  }, []);

  // Permet de voir les messages reçus non approuvés
  const getReceived = useCallback(() => {
    return receivedRef.current.filter((n) => n.approuved == false);
    // return receivedRef.current
  }, []);

  // Permet de voir les messages reçus et approuvés
  const getApprouved = useCallback(() => {
    return receivedRef.current.filter((n) => n.approuved == true);
  }, []);

  // Permet de suppr une notification du tableau (approuved or not)
  const removeObject = (obj: any): boolean => {
    receivedRef.current = receivedRef.current.filter((o) => o?.id != obj?.id);
    return true;
  };

  return (
    <WebSocketCtx.Provider
      value={{ sendObject, getReceived, getApprouved, removeObject }}
    >
      {children}
    </WebSocketCtx.Provider>
  );
};

const UseWS = () => {
  const context = useContext(WebSocketCtx);
  if (!context) {
    throw new Error("UseWS must be used within a WebSocketProvider");
  }
  return context;
};

export default UseWS;
