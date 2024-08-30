import { Item } from "@/models/item.model";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { History, PlusIcon, UserRoundCheck } from "lucide-react";
import UseWS from "@/lib/hooks/usewebsocket";
import { mapUser } from "@/lib/modelmapper";
import useGetData from "@/lib/hooks/useget";
import postData from "@/lib/hooks/usepost";
import { handleFollow, toggleIcons } from "@/services/follow.service";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";

export function ListBar({
    items,
    showAddButton = false,
    section,
}: {
    items: Item[];
    showAddButton?: boolean;
    section?: string
}) {
    const { toast } = useToast()
    const { sendObject: sendNotification } = UseWS()
    const { expect: users } = useGetData('/users', mapUser)
    const onFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
        const suggestFriendId = parseInt(`${e.currentTarget.value}`)
        const myId = parseInt(`${localStorage.getItem('userID')}`)
        const suggestFriend = handleFollow(e, { suggestFriendId, myId, users, sendNotification, postData, })
        console.log('suggestFriend.private :>> ', suggestFriend?.private);
        if (suggestFriend) {
            if (suggestFriend.private) {
                toast({
                    title: "Followed",
                    description: `You are now following this user ${suggestFriend.firstname}`,
                })
            } else {
                toast({
                    title: "Request sent",
                    description: `Your request has been sent to the user ${suggestFriend.firstname}`,
                })
            }
            e.currentTarget.parentElement?.remove()
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
                    {showAddButton && section == "friend" && (
                        <Button onClick={onFollow} value={item?.userId} variant="ghost" size="icon" className="h-6 w-6">
                            <Image
                                src="add.svg"
                                width={25}
                                height={25}
                                alt="home icon"
                                className="h-6 w-6 mx-2"
                            />
                        </Button>
                    )}
                    {showAddButton && section == "group" && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Image
                                src="add.svg"
                                width={25}
                                height={25}
                                alt="home icon"
                                className="h-6 w-6 mx-2"
                            />
                        </Button>
                    )}
                </li>
            ))}
            {/* Ajouter un bouton là pour paginer*/}

        </ul>
    );
}