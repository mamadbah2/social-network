import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
export default function NavigationBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background border rounded-lg">
      <div className="flex items-center space-x-2 ">
        <Button className="bg-[#292929] text-white">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="flex items-center justify-center w-60 space-x-10">
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="home.svg"
            width={25}
            height={25}
            alt="home icon"
            className="h-6 w-6"
          />
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="group.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="chat.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="notification.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="logout.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/placeholder.svg?height=32&width=32"
            alt="User avatar"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
