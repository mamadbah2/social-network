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

const GroupBarComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg" alt="Call Of Duty" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Call Of Duty</span>
            <span className="text-muted-foreground">•</span>
            <Link href="#" className="text-muted-foreground" prefetch={false}>
              View description
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Created at 01 / 05 / 2024</p>
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
        <Button variant="outline">JOIN</Button>
      </div>
    </div>
  );
};

export default GroupBarComponent;
