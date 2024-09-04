"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useReaction } from "@/lib/hooks/useReaction";
import { HeartCrack, HeartIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CommentModal from "./CommentModal";
import ProfileButton from "./ProfileLink";

interface PostCardProps {
  author?: number;
  postId: number;
  username: string;
  firstname: string;
  lastname: string;
  avatarSrc: string;
  date: string;
  title: string;
  content: string;
  imageSrc: string | null;
  likes: number;
  dislikes: number;
  comments: number;
}

export default function PostCard({
  author,
  postId,
  username,
  firstname,
  lastname,
  avatarSrc,
  date,
  title,
  content,
  imageSrc,
  likes,
  dislikes,
  comments,
}: PostCardProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const handleOpenCommentModal = () => setIsCommentModalOpen(true);
  const handleCloseCommentModal = () => setIsCommentModalOpen(false);
  const { handleReactionSubmit, loading, error } = useReaction();

  return (
    <Link href={`/post/${postId}`}>
      <Card className="max-w-2xl mx-auto">
        <CommentModal
          postId={postId}
          isOpen={isCommentModalOpen}
          onClose={handleCloseCommentModal}
          postTitle={title}
          postContent={content}
          postAuthor={username}
          avatarSrc={avatarSrc}
          postDate={date}
        />
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <ProfileButton id={author}>
            <Avatar>
              <AvatarImage src={avatarSrc} alt={firstname} />
              <AvatarFallback>
                {firstname.charAt(0).toUpperCase()}
                {lastname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ProfileButton>
          <div className="flex flex-col">
            <span className="font-semibold">{username}</span>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
        {imageSrc && (
          <CardContent className="pb-2 max-h-[450px] h-[420px] bg-contain w-full rounded-lg">
            <div className="relative w-full h-full rounded-lg">
              <Image
                src={`/upload/${imageSrc}`}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-start pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) =>
              handleReactionSubmit(e, {
                entityId: postId,
                reactionType: "post",
                isLike: true,
              })
            }
            className="text-muted-foreground"
          >
            <HeartIcon className="mr-1 h-6 w-6" />
            {likes}
          </Button>
          <Button
            variant="ghost"
            onClick={(e) =>
              handleReactionSubmit(e, {
                entityId: postId,
                reactionType: "post",
                isLike: false,
              })
            }
            size="sm"
            className="text-muted-foreground"
          >
            <HeartCrack className="mr-1 h-6 w-6" />
            {dislikes}
          </Button>
          <Button
            variant="ghost"
            onClick={handleOpenCommentModal}
            size="sm"
            className="text-muted-foreground"
          >
            <MessageCircleIcon className="mr-1 h-6 w-6" />
            {comments}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
