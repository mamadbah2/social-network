import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

export default function NavigationBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background border rounded-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          className="bg-secondary text-secondary-foreground"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
      <div className="flex items-center space-x-6">
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <HomeIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <UsersIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="text-primary" size="icon">
          <MessageCircleIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <BellIcon className="h-6 w-6" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/placeholder.svg?height=32&width=32"
            alt="User avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
