"use client";
import useGetData from "@/lib/hooks/useGet";
import postData from "@/lib/hooks/usepost";
import { PlusSquareIcon } from "lucide-react";
import React, { useEffect } from "react";
import UseWS from "../../lib/hooks/usewebsocket";
import { mapUser } from "../../lib/modelmapper";
import { Item } from "../../models/item.model";
import { handleFollow } from "../../services/follow.service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export function ListBar({
  items,
  showAddButton = false,
  section,
  mutation,
}: {
  items: Item[];
  showAddButton?: boolean;
  section?: string;
  onUpdateItems?: (items: Item[]) => void;
  mutation?: () => Promise<boolean | undefined>;
}) {
  const { toast } = useToast();
  const { sendObject: sendNotification } = UseWS();
  const { expect: users } = useGetData("/users", mapUser);
  const [listItem, setListItem] = React.useState<Item[]>(items);

  useEffect(() => {
    setListItem(items);
  }, [items]);

  const onFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const suggestFriendId = parseInt(`${e.currentTarget.value}`);
    const myId = parseInt(`${localStorage.getItem("userID")}`);
    const suggestFriend = handleFollow(e, {
      suggestFriendId,
      myId,
      users: users ?? [],
      sendNotification,
      postData,
    });
    mutation?.();
    if (suggestFriend) {
      if (!suggestFriend.private) {
        toast({
          title: "Followed",
          description: `You are now following ${suggestFriend.firstname}`,
        });
      } else {
        toast({
          title: "Request sent",
          description: `Your request has been sent to the user ${suggestFriend.firstname}`,
        });
      }
      mutation?.();
    }
  };

  const hidden = (e: React.MouseEvent<SVGSVGElement>) => {
    const hideIcon = e.currentTarget;
    !hideIcon.classList.contains("hidden")
      ? hideIcon.classList.add("hidden")
      : hideIcon.classList.remove("hidden");
  };

  return (
    <ul className="space-y-2 px-4">
      {listItem.map((item, index) => (
        <li key={item?.userId} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/upload/${item.image}`} alt={item.name} />
              <AvatarFallback>{item.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{item.name}</span>
          </div>
          {showAddButton && section == "friend" && (
            <Button
              onClick={onFollow}
              value={item?.userId}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <PlusSquareIcon className="h-5 w-5" onClick={hidden} />
            </Button>
          )}
          {showAddButton && section == "group" && (
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <PlusSquareIcon className="h-5 w-5" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
