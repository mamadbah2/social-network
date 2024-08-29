"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CreatePostModal from "@/components/uiperso/CreatePostModal";
import useWS from "@/lib/hooks/usewebsocket";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logout from "./logout";
import NotificationBar from "./notification";

export default function NavigationBar() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const handleCreatePostModalOpen = () => setIsCreatePostModalOpen(true);
  const handleCreatePostModalClose = () => setIsCreatePostModalOpen(false);
  const { getReceived } = useWS();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background border rounded-lg">
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={handleCreatePostModalClose}
      />
      <div className="flex items-center space-x-4 ">
        <Button
          className="bg-[#292929] text-white space-x-4"
          onClick={handleCreatePostModalOpen}
        >
          <Image
            src="add.svg"
            width={25}
            height={25}
            alt="home icon"
            className="h-6 w-6 mx-2"
          />
          Create Post
        </Button>
      </div>

      <div className="flex items-center justify-end w-96  space-x-16">
        <Link href={"/"}>
          <Button variant="ghost" className="text-muted-foreground" size="icon">
            <Image
              src="home.svg"
              width={25}
              height={25}
              alt="home icon"
              className="h-6 w-6"
            />
          </Button>
        </Link>
        <Link href={"/groups"}>
          <Button variant="ghost" className="text-muted-foreground" size="icon">
            <Image
              src="group.svg"
              width={25}
              height={25}
              alt="group icon"
              className="h-6 w-6"
            />
          </Button>
        </Link>
      </div>

      <div className="relative flex items-center justify-end  space-x-4">
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Image
            src="chat.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
        <NotificationBar isOpen={isOpenNotif} notifs={getReceived()} />
        <Button
          onClick={() => {
            setIsOpenNotif(!isOpenNotif);
            if (!isOpenNotif) {
              console.log("initNotif :>> ", getReceived());
            }
          }}
          variant="ghost"
          className="text-muted-foreground"
          size="icon"
        >
          <Image
            src="notification.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>
        <Logout />
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
