import { Notification } from "@/models/notification.model";
import { useEffect, useRef, useState } from "react";
import { mapNotification } from "../modelmapper";


const useWS = <T>(uri: string, mapper: (obj: any)=>T[]) => {
    const [ws, setWS] = useState<WebSocket>()
    const [initData, setInitData] = useState<T[]>([])
    const wsRef = useRef<WebSocket>()

    useEffect(() => {
        wsRef.current = new WebSocket("ws://localhost:4000" + uri)
        wsRef.current.onopen = () => {
            console.log("WebSocket connected successfully");
            setWS(wsRef.current)
            if (wsRef.current) {
                wsRef.current.onmessage = (e) => {
                    // console.log('Message received: ', JSON.parse(e.data));
                    setInitData(mapper(JSON.parse(e.data)))
                };
            }
        }
        wsRef.current.onclose = () => {
            console.log('WebSocket closed. Reconnecting...');
            setTimeout(() => useWS(uri, mapper), 3000);
        }
        return () => {
            wsRef.current?.close()
        };
    }, [uri])

    const sendObject = (obj : T):boolean => {
        if (ws && ws.readyState == WebSocket.OPEN) {
            ws.send(JSON.stringify(obj))
            return true
        }
        return false
    }

    return {
        ws,
        initData,
        sendObject,
    }
}

export default useWS