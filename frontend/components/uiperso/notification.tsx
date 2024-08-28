import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Notification } from "@/models/notification.model"

interface NotificationProps {
    isOpen: Boolean,
    notifs: Notification[],
}
 
const NotificationBar: React.FC<NotificationProps> = ({
    isOpen,
    notifs,
}) => {
    if (!isOpen) {
        return null
    }

    const notifications = notifs ||  [
        { sender: {firstname: "Bobo"}, content: "request to follow your account",  },
        { sender: {firstname: "Jonh"}, content: "request to join your group",  },
        { sender: {firstname: "Murielle"}, content: "follow you",  },
    ]

    return (
        <Card className="absolute top-10 z-10  w-full min-w-80 max-w-sm mx-auto bg-white shadow-lg rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl font-bold">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>{notification.sender!.firstname![0].toUpperCase() ?? "N/A" }</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1 min-w-0">
                            <p className="text-xs sm:text-sm leading-tight">
                                <span className="font-medium">{notification.sender.firstname}</span>{" "}
                                <span className="text-muted-foreground break-words">{notification.content}</span>
                            </p>
                        </div>
                        <div className="flex space-x-1 flex-shrink-0">
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                <span className="sr-only">Accept</span>
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                                <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                <span className="sr-only">Decline</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default NotificationBar