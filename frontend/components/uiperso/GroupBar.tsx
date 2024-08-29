import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type IconProps = React.SVGProps<SVGSVGElement>;

const MessageSquareIcon: React.FC<IconProps> = (props) => {
  return (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

const PlusIcon: React.FC<IconProps> = (props) => {
  return (
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
};

interface GroupBarProps {
  imgSrc: string;
  groupName: string;
  createdAt: string;
  descriptionLink: string;
  creator: boolean;
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
}


const GroupBarComponent: React.FC<GroupBarProps> = ({ imgSrc, groupName, createdAt, descriptionLink, creator, setShowForm }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md">
      {groupName ? (
        <>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={imgSrc} alt={groupName} />
            <AvatarFallback>{groupName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{groupName}</span>
              <span className="text-muted-foreground">•</span>
              <Link href={descriptionLink} className="text-muted-foreground" prefetch={false}>
                View description
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Created at {createdAt}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-1">
            <MessageSquareIcon className="w-4 h-4" />
          </Button>
          <Button variant="default" className="flex items-center space-x-1">
            <PlusIcon className="w-4 h-4" />
            <span>Create Post</span>
          </Button>
          <Button variant="default" className="flex items-center space-x-1">
            <PlusIcon className="w-4 h-4" />
            <span>Create Event</span>
          </Button>
          {creator && (
            <Button variant="default" className="flex items-center space-x-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Member's'</span>
            </Button>
          )}
        </div>
        </>
      ) : (
        setShowForm && (
        <Button onClick={() => setShowForm(true)} variant="default" className="flex items-center space-x-1">
          <PlusIcon className="w-4 h-4" />
          <span>Create Group</span>
        </Button>
        )
      )}
    </div>
  );
};


export default GroupBarComponent