'use client'

import { Notification } from "@/models/notification.model";
import { useEffect, useRef, useCallback, createContext, useContext } from "react";
import { mapNotification } from "../modelmapper";
import { json } from "stream/consumers";

const WebSocketCtx = createContext<{
    sendObject: <T>(obj: T) => boolean,
    getReceived: <T>() => T[],
} | null>(null)


export const WsProvider: React.FC<{
    uri: string;
    mapper: (obj: any) => any[];
    children: React.ReactNode;
}> = ({ uri, mapper, children }) => {
    const wsRef = useRef<WebSocket | null>(null);
    const receivedRef = useRef<any[]>([]);

    useEffect(() => {
        wsRef.current = new WebSocket("ws://localhost:4000" + uri);

        wsRef.current.onopen = () => {
            console.log("WebSocket connected successfully");
        };

        wsRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('data for onmessage :>> ', data);

            if (data) {
                if (Array.isArray(data)) {
                    console.log("-----------Is ARRAY ");
                    console.log('received before push :>> ', receivedRef.current);
                    receivedRef.current = mapper(data);
                    console.log('received after push :>> ', receivedRef.current);
                } else {
                    console.log("-----------Is SIMPLE DATA ");
                    console.log('received before push :>> ', receivedRef.current);
                    receivedRef.current = [...receivedRef.current, ...mapper(data)];
                    console.log('received after push :>> ', receivedRef.current);
                }
            }
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket closed. Reconnecting...');
            setTimeout(() => WsProvider({ uri, mapper, children }), 3000);
        };

        return () => {
            wsRef.current?.close();
        };
    }, [uri, mapper]);

    const sendObject = useCallback((obj: any): boolean => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(obj));
            return true;
        }
        return false;
    }, []);

    const getReceived = useCallback(() => {
        console.log(receivedRef.current)
        return receivedRef.current
    }, [])
    return (
        <WebSocketCtx.Provider value={{ sendObject, getReceived }}>
            {children}
        </WebSocketCtx.Provider>
    )
};

const useWS = () => {
    const context = useContext(WebSocketCtx);
    if (!context) {
        throw new Error("useWS must be used within a WebSocketProvider");
    }
    return context;
}

export default useWS