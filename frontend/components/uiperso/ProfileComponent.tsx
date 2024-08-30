"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetData from "@/lib/hooks/useget";
import { mapSimpleUser } from "@/lib/modelmapper";
import { User } from "@/models/user.model";
import Link from "next/link";
import { useState } from "react";
import PostSection from "./PostSection";
import FollowModal from "./followerList";

interface FollowModalState {
  isOpen: boolean;
  modalName: string;
  follow?: User[];
}

export default function ProfileComponent({ id }: { id: string }) {
  const { expect: user, error: errUser } = useGetData(
    `/users?id=${id}`,
    mapSimpleUser
  );

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

  console.log(user);

  return (
    <>
      <FollowModal
        isOpen={FollowModalData.isOpen}
        onClose={handleCloseFollowModal}
        modalName={FollowModalData.modalName}
        Follow={FollowModalData.follow}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-2xl w-full mx-auto p-4 space-y-4 sm:space-y-0 sm:space-x-4 bg-background rounded-lg mb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="{" />
            <AvatarFallback>
              {user.firstname.charAt(0).toUpperCase()}
              {user.lastname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">{user.nickname}</h2>
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                View About me
              </Link>
            </div>
            <p className="text-sm text-gray-500">Created at 01 / 05 / 2024</p>
          </div>
        </div>
        <div className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
          <button
            onClick={() => handleOpenFollowModal("Followers", user.followers)}
          >
            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user.followers?.length}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </button>
          <button
            onClick={() => handleOpenFollowModal("Following", user.followed)}
          >
            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user.followed?.length}</span>
              <span className="text-gray-500">Following</span>
            </div>
          </button>
          <div className="flex flex-col items-center sm:items-center">
            <span className="font-semibold">{user.posts?.length}</span>
            <span className="text-gray-500">Post</span>
          </div>
        </div>
      </div>
      <PostSection posts={user.posts} />
    </>
  );
}
