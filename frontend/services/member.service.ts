import { Notification } from "@/models/notification.model";

type HandleMemberParams = {
    groupId?: number;
    authorGroupId?: number;
    myId: number;
    sendNotification?: <T>(notif: T) => boolean; 
};

export const handleMember = (
    e: React.MouseEvent<HTMLButtonElement>,
    {
        groupId,
        authorGroupId,
        myId,
        sendNotification,
    }: HandleMemberParams
) => {
    e.preventDefault();

    let notif: Notification = {
        content: "want to join your group",
        approuved: false,
        entityType: "group",
        entityId: groupId ?? 0,
        sender: { id: myId },
        receiver: { id: authorGroupId },
    };
    if (sendNotification) {
        sendNotification(notif)
    }
};

