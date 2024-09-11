"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetData from "@/lib/hooks/useGet";
import postData from "@/lib/hooks/usepost";
import UseWS from "@/lib/hooks/usewebsocket";
import { mapSimpleUser, mapUser } from "@/lib/modelmapper";
import { User } from "@/models/user.model";
import { handleFollow, handleUnfollow } from "@/services/follow.service";
import { Lock, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import FollowModal from "./followerList";
import PostSection from "./PostSection";
import UserInfo from "./UserInfo";

interface FollowModalState {
  isOpen: boolean;
  modalName: string;
  follow?: User[];
}

export default function ProfileComponent({ id }: { id: string }) {
  const { sendObject: sendNotification } = UseWS();
  const { expect: users } = useGetData("/users", mapUser);
  const { expect: user, error: errUser } = useGetData(
    `/users?id=${id}`,
    mapSimpleUser
  );
  const { expect: me, error: errMe } = useGetData(
    `/users?id=${localStorage.getItem("userID")}`,
    mapSimpleUser
  );

  const [FollowModalData, setFollowModalData] = useState<FollowModalState>({
    isOpen: false,
    modalName: "",
    follow: [], // Initialize with an empty array
  });

  const showButtonFollow = (): boolean => {
    return me?.suggestedFriends?.find((f) => f.id === parseInt(id))
      ? true
      : false;
  };

  const showButtonUnFollow = (): boolean => {
    return me?.followed?.find((f) => f.id === parseInt(id)) ? true : false;
  };

  const onFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const suggestFriendId = parseInt(`${e.currentTarget.value}`);
    const myId = parseInt(`${localStorage.getItem("userID")}`);
    const suggestFriend = handleFollow(e, {
      suggestFriendId,
      myId,
      users: users ?? [],
      sendNotification,
      postData,
    });

    if (suggestFriend) {
      if (!suggestFriend.private) {
        toast({
          title: "Followed",
          description: `You are now following ${suggestFriend.firstname}`,
        });
      } else {
        toast({
          title: "Request sent",
          description: `Your request has been sent to the user ${suggestFriend.firstname}`,
        });
      }
    }
  };

  const unFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const followerID = parseInt(`${e.currentTarget.value}`);
    const myId = parseInt(`${localStorage.getItem("userID")}`);
    const suggestFriend = handleUnfollow(e, {
      followerId: followerID,
      myId,
      users: users ?? [],
      postData,
    });

    if (suggestFriend) {
      toast({
        title: "Unfollowed",
        description: `You are now unfollowing ${suggestFriend.firstname}`,
      });
    }
  };

  const hidden = (e: React.MouseEvent<SVGSVGElement>) => {
    const hideIcon = e.currentTarget;
    !hideIcon.classList.contains("hidden")
      ? hideIcon.classList.add("hidden")
      : hideIcon.classList.remove("hidden");
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

  if (
    user?.private &&
    !me?.followed?.find((f) => f.id === parseInt(id)) &&
    localStorage.getItem("userID") !== id
  ) {
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
              <AvatarImage src={`/upload/${user?.profilePicture}`} alt="{" />
              <AvatarFallback>
                {user?.firstname.charAt(0).toUpperCase()}
                {user?.lastname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">{user?.nickname}</h2>
              </div>
              <p className="text-sm text-gray-500">Account Private</p>
            </div>
          </div>
          <div className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user?.followers?.length}</span>
              <span className="text-gray-500">Followers</span>
            </div>

            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user?.followed?.length}</span>
              <span className="text-gray-500">Following</span>
            </div>

            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">
                {" "}
                <Lock className="h-6 w-6 " />
              </span>
              <span className="text-gray-500">Posts</span>
            </div>
          </div>

          {
            // If the user is not the current user, show the follow button
            parseInt(`${localStorage.getItem("userID")}`) !== parseInt(id) &&
              showButtonFollow() && (
                <>
                  <Button
                    onClick={onFollow}
                    value={id}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <UserPlus className="h-7 w-7" onClick={hidden} />
                  </Button>
                </>
              )
          }
          {
            // If the user is not the current user, show the follow button
            parseInt(`${localStorage.getItem("userID")}`) !== parseInt(id) &&
              showButtonUnFollow() && (
                <>
                  <Button
                    onClick={unFollow}
                    value={id}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <UserMinus
                      className="h-7 w-7 text-red-600"
                      onClick={hidden}
                    />
                  </Button>
                </>
              )
          }
        </div>
      </>
    );
  }

  return (
    <>
      <FollowModal
        isOpen={FollowModalData.isOpen}
        onClose={handleCloseFollowModal}
        modalName={FollowModalData.modalName}
        Follow={FollowModalData.follow}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-3xl w-full mx-auto p-4 space-y-4 sm:space-y-0 sm:space-x-4 bg-background rounded-lg mb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`/upload/${user?.profilePicture}`} alt="{" />
            <AvatarFallback>
              {user?.firstname.charAt(0).toUpperCase()}
              {user?.lastname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">{user?.nickname}</h2>
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                View About me
              </Link>
            </div>
            <p className="text-sm text-gray-500">Created at 01 / 05 / 2024</p>
          </div>
        </div>
        <div className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
          <button
            onClick={() => handleOpenFollowModal("Followers", user?.followers)}
          >
            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user?.followers?.length}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </button>
          <button
            onClick={() => handleOpenFollowModal("Following", user?.followed)}
          >
            <div className="flex flex-col items-center sm:items-center">
              <span className="font-semibold">{user?.followed?.length}</span>
              <span className="text-gray-500">Following</span>
            </div>
          </button>
          <div className="flex flex-col items-center sm:items-center">
            <span className="font-semibold">{user?.posts?.length}</span>
            <span className="text-gray-500">Posts</span>
          </div>
          <UserInfo user={user} />
        </div>
        {
          // If the user is not the current user, show the follow button
          parseInt(`${localStorage.getItem("userID")}`) !== parseInt(id) &&
            showButtonFollow() && (
              <>
                <Button
                  onClick={onFollow}
                  value={id}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <UserPlus className="h-7 w-7" onClick={hidden} />
                </Button>
              </>
            )
        }
        {
          // If the user is not the current user, show the follow button
          parseInt(`${localStorage.getItem("userID")}`) !== parseInt(id) &&
            !showButtonFollow() && (
              <>
                <Button
                  onClick={unFollow}
                  value={id}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <UserMinus
                    className="h-7 w-7 text-red-600"
                    onClick={hidden}
                  />
                </Button>
              </>
            )
        }
      </div>
      <PostSection posts={user?.posts ?? []} />
    </>
  );
}
