import { Notification } from "@/models/notification.model";
import { User } from "@/models/user.model";

type HandleFollowParams = {
    suggestFriendId: number;
    myId: number;
    users: User[];
    sendNotification: <T>(notif: T) => boolean; // Ici correspond au send Object du UseWS
    postData: (url: string, formData: FormData) => Promise<any[]>;
};

export const toggleIcons = (hideIcon: Element | null, showIcon: Element | null) => {
    hideIcon?.classList.add("hidden");
    showIcon?.classList.remove("hidden");
};

export const handleFollow = (
    e: React.MouseEvent<HTMLButtonElement>,
    { suggestFriendId, myId, users, sendNotification, postData }: HandleFollowParams
) => {
    e.preventDefault();
    const suggestFriend = users.find((user) => user.id === suggestFriendId);
    if (!suggestFriend) return undefined;
    console.log('suggestFriend :>> ', suggestFriend);
    if (suggestFriend.private) {
        let notif: Notification = {
            content: "want follow you",
            approuved: false,
            entityType: "follow",
            entityId: suggestFriendId,
            sender: { id: myId },
            receiver: { id: suggestFriendId },
        };
        console.log('sendNotification(notif) :>> ', sendNotification(notif))    

        if (sendNotification(notif)) return suggestFriend;
    } else {
        const formData = new FormData();
        formData.append("followedID", `${suggestFriendId}`);
        formData.append("followerID", `${myId}`);
        formData.append("action", "follow");

        postData('/follow', formData).then(([res, err]) => {
            if (res) return suggestFriend;
        });
    }
    return suggestFriend;
};