import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import postData from "@/lib/hooks/usepost";
import { mapSimpleComments, mapSimpleUser } from "@/lib/modelmapper";
import { ImageIcon, Send, X } from "lucide-react";
import React, { FormEvent, useRef } from "react";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  avatarSrc: string;
  postDate: string;
  postTitle: string;
  postContent: string;
  postId: number;
}

export default function CommentModal({
  isOpen,
  onClose,
  postAuthor,
  avatarSrc,
  postDate,
  postTitle,
  postContent,
  postId,
}: CommentModalProps) {
  if (!isOpen) return null;

  const { setComment } = usePostContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { expect: user, error: errUser } = useGetData(
    `/users?id=${localStorage.getItem("userID")}`,
    mapSimpleUser
  );

  const useHandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Trim and validate input
    const commentContent = (formData.get("CommentContent") as string).trim();

    // Add error styling and message if comment content is empty
    const commentInput = e.currentTarget.querySelector(
      'input[name="CommentContent"]'
    ) as HTMLInputElement;
    const errorMessage = e.currentTarget.querySelector(
      ".error-message"
    ) as HTMLElement;

    if (!commentContent) {
      commentInput.classList.add("border-red-500");
      if (errorMessage) {
        errorMessage.classList.remove("hidden");
      }
      return;
    }

    // Remove error styling if input is valid
    commentInput.classList.remove("border-red-500");
    if (errorMessage) {
      errorMessage.classList.add("hidden");
    }
    let target = e.currentTarget;
    const [resp, err] = await postData(
      `/comment?Id=${String(postId)}`,
      formData,
      true
    );
    if (Object.keys(err).length == 0) {
      if (resp) {
        if (
          window.location.pathname !== "/" &&
          !window.location.pathname.startsWith("/groups")
        ) {
          console.log("window.location.pathname", window.location.pathname);
          let oneComment = mapSimpleComments(resp);
          setComment(oneComment);
        }
      }
      onClose();
    } else {
      console.log("ERR :>>", err);
      Object.keys(err).forEach((key) => {
        console.log("key :>> ", key);
        target.querySelector(`[name=${key}]`)?.classList.add("border-red-500");
        setTimeout(() => {
          target
            .querySelector(`[name=${key}]`)
            ?.classList.remove("border-red-500");
        }, 2000);
      });
    }
  };

  const handleClickImg = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-[95vw] md:max-w-[400px] bg-white shadow-lg rounded-lg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarSrc} alt="Cherif" />
              <AvatarFallback>
                {postAuthor.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{postAuthor}</p>
              <p className="text-sm text-muted-foreground">{postDate}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{postTitle}</h2>
          <p className="text-sm text-muted-foreground max-h-[150px] overflow-y-auto">
            {postContent}
          </p>
        </div>
        <div className="flex items-center space-x-2 p-4 border-t">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>
              {user?.firstname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <form
            onSubmit={useHandleSubmit}
            className="flex items-center space-x-2 w-full"
            method="post"
            encType="multipart/form-data"
          >
            <Input
              className="flex-grow"
              name="CommentContent"
              placeholder="Write your comment"
            />
            <Input
              type="file"
              name="commentImage"
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              onClick={handleClickImg}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send comment</span>
            </Button>
            <p className="error-message text-red-500 mt-2 hidden">
              Comment cannot be empty or just spaces.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
