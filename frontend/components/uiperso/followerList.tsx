import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/models/user.model";
import { X } from "lucide-react";
import ProfileButton from "./ProfileLink";

interface followModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalName: string;
  Follow?: User[];
}

export default function FollowModal({
  isOpen,
  onClose,
  modalName,
  Follow,
}: followModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-[95vw] md:max-w-[400px] bg-white rounded-lg shadow-lg relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close followers list"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">{modalName}</h2>
          <ul className="space-y-4">
            {Follow?.map((follower, index) => (
              <li key={index} className="flex items-center space-x-3">
                <ProfileButton id={follower.id}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={follower.profilePicture}
                      alt={follower.nickname}
                    />
                    <AvatarFallback>
                      {follower.firstname.charAt(0).toUpperCase()}
                      {follower.lastname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ProfileButton>
                <span className="text-sm font-medium">{follower.nickname}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
