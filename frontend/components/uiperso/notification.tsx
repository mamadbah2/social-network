"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import postData from "@/lib/hooks/usepost";
import UseWS from "@/lib/hooks/usewebsocket";
import { Notification } from "@/models/notification.model";
import { Check, X } from "lucide-react";

interface NotificationProps {
  isOpen: Boolean;
  notifs: Notification[];
}

const NotificationBar: React.FC<NotificationProps> = ({ isOpen, notifs }) => {
  const { sendObject, removeObject } = UseWS();

  if (!isOpen) {
    return null;
  }

  const handleSupprNotif = (e: React.MouseEvent<HTMLButtonElement>) => {
    const notifID = parseInt(`${e.currentTarget.getAttribute("data-notif")}`);
    const senderId = e.currentTarget.getAttribute("data-sender");
    const entityType = e.currentTarget.getAttribute("data-entity");
    sendObject({
      id: notifID,
      approuved: true,
      sender: { id: parseInt(`${senderId}`) },
      receiver: { id: parseInt(`${localStorage.getItem("userID")}`) },
    });
    e.currentTarget.parentElement?.parentElement?.remove();
    removeObject({ id: notifID });
  };

  const handleValidNotif = (e: React.MouseEvent<HTMLButtonElement>) => {
    const senderId = e.currentTarget.getAttribute("data-sender");
    const entityType = e.currentTarget.getAttribute("data-entity");
    const target = e.currentTarget;
    switch (entityType) {
      case "follow":
        const formData = new FormData();
        formData.append("followedID", `${localStorage.getItem("userID")}`);
        formData.append("followerID", `${senderId}`);
        formData.append("action", "follow");
        postData("/follow", formData).then(([res, err]) => {
          if (res) {
            const notifID = parseInt(`${target.getAttribute("data-notif")}`);
            sendObject({
              id: notifID,
              approuved: true,
              sender: { id: parseInt(`${senderId}`) },
              receiver: { id: parseInt(`${localStorage.getItem("userID")}`) },
            });
            target.parentElement?.parentElement?.remove();
            removeObject({ id: notifID });
          }
        });
        break;

      default:
        break;
    }
  };

  const notifications = notifs;

  return (
    <Card className="absolute top-10 z-10  w-full min-w-80 max-w-sm mx-auto bg-white shadow-lg rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-bold">
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((n, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>
                {n.sender!.firstname![0].toUpperCase() ?? "N/A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-xs sm:text-sm leading-tight">
                <span className="font-medium">{n.sender?.firstname}</span>{" "}
                <span className="text-muted-foreground break-words">
                  {n.content}
                </span>
              </p>
            </div>
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                onClick={handleValidNotif}
                data-sender={n.sender?.id}
                data-entity={n.entityType}
                data-notif={n.id}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white bg-gray-700" />
                <span className="sr-only">Accept</span>
              </Button>
              <Button
                onClick={handleSupprNotif}
                data-sender={n.sender?.id}
                data-entity={n.entityType}
                data-notif={n.id}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className="sr-only">Decline</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationBar;
