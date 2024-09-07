"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReactionOptions, useReaction } from "@/lib/hooks/useReaction";
import { Reaction } from "@/models/reaction.model";
import { HeartCrack, HeartIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, use, useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import ProfileButton from "./ProfileLink";
import useGetData from "@/lib/hooks/useGet";
import { mapReactionType, mapUser } from "@/lib/modelmapper";
import { usePostContext } from "@/lib/hooks/postctx";

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
  const [liked, setLiked] = useState(likes);
  const [disliked, setDisliked] = useState(dislikes);
  const { handleReactionSubmit, loading, error } = useReaction();
  const {comment}  = usePostContext();
  const [numberComment, setNumberComment] = useState(comments);
  const [reactionBefore, setReactionBefore] = useState<Reaction>({
    liked: false,
    disliked: false,
  });
  
  const {expect: initialReaction} = useGetData(`/reaction?postId=${postId}&reaction_type=post`, mapReactionType );
  useEffect(() => {
    setReactionBefore(initialReaction ?? {liked: false, disliked: false});
  }, [initialReaction])

  useEffect(() => {
    if (comment) {
      setNumberComment((prev)=>prev+1);
    }   
  },[comment]);

  // Handle reaction pour gerer les likes et dislikes
  const handleReact = (
    e: FormEvent<HTMLButtonElement>,
    { entityId, reactionType, isLike }: ReactionOptions
  ) => {
    handleReactionSubmit(e, {
      entityId: entityId,
      reactionType: reactionType,
      isLike: isLike,
    }).then((resp) => {
      if (resp.liked && !resp.disliked) {
         if (reactionBefore.disliked) {
          setDisliked((prev) => prev - 1);
          setLiked((prev) => prev + 1);
        } else {
          setLiked((prev) => prev + 1);
        }
      } else if (!resp.liked && resp.disliked) {
        if (reactionBefore.liked) {
          setLiked((prev) => prev - 1);
          setDisliked((prev) => prev + 1);
        } else {
          setDisliked((prev) => prev + 1);
        }
      } else if (!resp.liked && !resp.disliked) {
        if (reactionBefore.liked) {
          setLiked((prev) => prev - 1);
        } else if (reactionBefore.disliked) {
          setDisliked((prev) => prev - 1);
        }
      }
      setReactionBefore(resp);
    });
  };
  return (
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
      <Link href={`/post/${postId}`}>
        <CardContent className="pb-2">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
        {imageSrc!="" && (
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
      </Link>
      <CardFooter className="flex justify-start pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) =>
            handleReact(e, {
              entityId: postId,
              reactionType: "post",
              isLike: true,
            })
          }
          className="text-muted-foreground"
        >
          <HeartIcon className="mr-1 h-6 w-6" />
          {liked}
        </Button>
        <Button
          variant="ghost"
          onClick={(e) =>
            handleReact(e, {
              entityId: postId,
              reactionType: "post",
              isLike: false,
            })
          }
          size="sm"
          className="text-muted-foreground"
        >
          <HeartCrack className="mr-1 h-6 w-6" />
          {disliked}
        </Button>
        <Button
          variant="ghost"
          onClick={handleOpenCommentModal}
          size="sm"
          className="text-muted-foreground"
        >
          <MessageCircleIcon className="mr-1 h-6 w-6" />
          {numberComment}
        </Button>
      </CardFooter>
    </Card>
  );
}
