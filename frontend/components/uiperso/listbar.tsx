import { Item } from "@/models/item.model";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import useWS from "@/lib/hooks/usewebsocket";
import { mapNotification } from "@/lib/modelmapper";
import { Notification } from "@/models/notification.model";
import { User } from "@/models/user.model";
import useGetData from "@/lib/hooks/useget";

export function ListBar({
    items,
    showAddButton = false,
}: {
    items: Item[];
    showAddButton?: boolean;
}) {
    const { sendObject } = useWS()

    const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const suggestFriendId = parseInt( e.currentTarget.value)
        const myId = localStorage.getItem('userID') || ""
        let notif: Notification = {
            content : "want follow you",
            approuved: false,
            entityType:"follow",
            entityId:suggestFriendId,
            sender: {id : parseInt(myId)} ,
            receiver: {id: suggestFriendId} ,
        }
        if ( sendObject(notif) ) {
            console.log('notifs send successful :>> ', notif);
        }
    }

    return (
        <ul className="space-y-2 px-4">
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={item.image} alt={item.name} />
                            <AvatarFallback>{item.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.name}</span>
                    </div>
                    {showAddButton && (
                        <Button onClick={handleFollow} value={item?.userId} variant="ghost" size="icon" className="h-6 w-6">
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    )}
                </li>
            ))}
            {/* Ajouter un bouton là pour paginer */}
        </ul>
    );
}