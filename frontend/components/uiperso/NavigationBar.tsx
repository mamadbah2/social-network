"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CreatePostModal from "@/components/uiperso/CreatePostModal";
import UseWS from "@/lib/hooks/usewebsocket";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logout from "./logout";
import NotificationBar from "./notification";

export default function NavigationBar() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const { getReceived } = UseWS();
  const handleCreatePostModalOpen = () => setIsCreatePostModalOpen(true);
  const handleCreatePostModalClose = () => setIsCreatePostModalOpen(false);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background border rounded-lg">
      {/* Le modal de création de post */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={handleCreatePostModalClose}
      />
      {/* Le bouton de création de post */}
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
        {/* Lien pour la page d'accueil */}
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

        {/* Lien pour la page de groupe */}
        <Link href={"/"}>
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

      {/* Bouton pour le chat box */}
      <div className="relative flex items-center justify-end  space-x-4">
        <Button
          onClick={() => {
            setIsChatboxOpen(!isChatboxOpen);
          }}
          variant="ghost"
          className="text-muted-foreground"
          size="icon"
        >
          <Image
            src="chat.svg"
            width={25}
            height={25}
            alt="group icon"
            className="h-6 w-6"
          />
        </Button>

        {/* La petite bulle de notification */}
        <NotificationBar isOpen={isOpenNotif} notifs={getReceived()} />

        {/* Bouton pour les notifications */}
        <Button
          onClick={() => {
            setIsOpenNotif(!isOpenNotif);
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

        {/* Bouton pour le logout */}
        <Logout />

        {/* Bouton pour le profil */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
