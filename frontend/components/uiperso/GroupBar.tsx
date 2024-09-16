import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UseWS from "@/lib/hooks/usewebsocket";
import { User } from "@/models/user.model";
import { handleMember } from "@/services/member.service";
import Link from "next/link";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { toast } from "../ui/use-toast";
import FollowModal from "./followerList";

type IconProps = React.SVGProps<SVGSVGElement>;

const UserIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PlusIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

interface GroupBarProps {
  imgSrc: string;
  groupName: string;
  createdAt: string;
  descriptionLink: string;
  authorId?: number;
  groupId?: number;
  creator: boolean;
  isMember?: boolean;
  members?: User[];
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreatePost?: () => void;
  handleCreateEvent?: () => void;
}
interface FollowModalState {
  isOpen: boolean;
  modalName: string;
  follow?: User[];
}

const GroupBarComponent: React.FC<GroupBarProps> = ({
  imgSrc,
  groupName,
  createdAt,
  descriptionLink,
  groupId,
  authorId,
  creator,
  isMember,
  members,
  setShowForm,
  handleCreatePost,
  handleCreateEvent,
}) => {
  const { sendObject: sendNotification } = UseWS();
  const [FollowModalData, setFollowModalData] = useState<FollowModalState>({
    isOpen: false,
    modalName: "",
    follow: [], // Initialize with an empty array
  });

  const addMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    const myId = parseInt(`${localStorage.getItem("userID")}`);
    const authorGroupId = authorId || 0;
    handleMember(e, {
      groupId,
      authorGroupId,
      myId,
      sendNotification,
    });

    toast({
      title: "Request sent",
      description: `Your request to join ${groupName} has been sent to the group owner `,
    });
  };

  const handleOpenFollowModal = (name: string, follow?: User[]) =>
    setFollowModalData({
      isOpen: true,
      modalName: name,
      follow: follow,
    });
  const handleCloseFollowModal = () =>
    setFollowModalData({
      isOpen: false,
      modalName: "",
      follow: [],
    });

  return (
    <div className="w-full flex justify-center overflow-hidden">
      {groupName ? (
        <>
          <div className="flex items-center justify-between gap-8 p-4 ml-4 mr-0 mb-4 w-fit overflow-hidden bg-white rounded-md fixed top-23 z-10">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={imgSrc} alt={groupName} />
                <AvatarFallback>
                  {groupName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <HoverCard>
                    <HoverCardTrigger className=" cursor-pointer">
                      {groupName.length > 10
                        ? `${groupName.substring(0, 10)}...`
                        : groupName}
                    </HoverCardTrigger>
                    <HoverCardContent>{groupName}</HoverCardContent>
                  </HoverCard>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href={descriptionLink}
                    className="text-muted-foreground"
                    prefetch={false}
                  >
                    View description
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created at {createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isMember && (
                <>
                  <FollowModal
                    isOpen={FollowModalData.isOpen}
                    onClose={handleCloseFollowModal}
                    modalName={FollowModalData.modalName}
                    Follow={FollowModalData.follow}
                  />
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() =>
                      handleOpenFollowModal("Group Members", members)
                    }
                  >
                    <UserIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    variant="default"
                    className="2xl:flex items-center space-x-1 w-20 text-xs 2xl:w-full"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Post</span>
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    variant="default"
                    className="flex items-center space-x-1 w-20 text-xs 2xl:w-full"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Event</span>
                  </Button>
                  {
                    <Button
                      onClick={() => setShowForm && setShowForm(true)}
                      variant="default"
                      className="flex items-center space-x-1 w-20 text-xs 2xl:w-full"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Add Members</span>
                    </Button>
                  }
                </>
              )}
              {!isMember && (
                <Button
                  onClick={(e) => {
                    console.log("add member");
                    addMember(e);
                  }}
                  variant="default"
                  className="flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Join</span>
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        setShowForm && (
          <div className="flex justify-center items-center w-max px-4 py-2 h-full rounded-md bg-white">
            <Button
              onClick={() => setShowForm(true)}
              variant="default"
              className="flex items-center space-x-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Group</span>
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default GroupBarComponent;
