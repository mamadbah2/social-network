import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import FollowModal from "./followerList";
import { User } from "@/models/user.model";

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
  creator,
  isMember,
  members,
  setShowForm,
  handleCreatePost,
  handleCreateEvent,
}) => {
  const [FollowModalData, setFollowModalData] = useState<FollowModalState>({
    isOpen: false,
    modalName: "",
    follow: [], // Initialize with an empty array
  });

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
    <div className="flex items-center justify-between p-4 bg-white border rounded-md sticky top-0 z-10">
      {groupName ? (
        <>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={imgSrc} alt={groupName} />
              <AvatarFallback>
                {groupName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{groupName}</span>
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
                  className="flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Post</span>
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  variant="default"
                  className="flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Event</span>
                </Button>
                {creator && (
                  <Button
                    onClick={() => setShowForm && setShowForm(true)}
                    variant="default"
                    className="flex items-center space-x-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Members</span>
                  </Button>
                )}
              </>
            )}
            {!isMember && (
              <Button
                onClick={handleCreateEvent}
                variant="default"
                className="flex items-center space-x-1"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Join</span>
              </Button>
            )}
          </div>
        </>
      ) : (
        setShowForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="default"
            className="flex items-center space-x-1"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Group</span>
          </Button>
        )
      )}
    </div>
  );
};

export default GroupBarComponent;
