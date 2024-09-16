"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import { ReactionOptions, useReaction } from "@/lib/hooks/useReaction";
import { mapReactionType } from "@/lib/modelmapper";
import { Reaction } from "@/models/reaction.model";
import { HeartCrack, HeartIcon, MessageCirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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
  isLocked?: boolean;
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
  isLocked,
}: PostCardProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const handleOpenCommentModal = () => setIsCommentModalOpen(true);
  const handleCloseCommentModal = () => setIsCommentModalOpen(false);
  const [liked, setLiked] = useState(likes);
  const [disliked, setDisliked] = useState(dislikes);
  const { handleReactionSubmit, loading, error } = useReaction();
  const { incrementComment, setIncrementComment } = usePostContext();

  const [reactionBefore, setReactionBefore] = useState<Reaction>({
    liked: false,
    disliked: false,
  });

  const { expect: initialReaction } = useGetData(
    `/reaction?entityID=${postId}&reaction_type=post`,
    mapReactionType
  );
  useEffect(() => {
    setReactionBefore(initialReaction ?? { liked: false, disliked: false });
  }, [initialReaction]);

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
        isOpen={!isLocked ? isCommentModalOpen : false}
        onClose={handleCloseCommentModal}
        postTitle={title}
        postContent={content}
        postAuthor={firstname}
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
          <span className="font-semibold">{firstname}</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
      </CardHeader>
      <Link href={!isLocked ? `/post/${postId}` : ""}>
        <CardContent className="pb-2">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
        {imageSrc != "" && (
          <CardContent className="pb-2 max-h-[450px] h-[420px] bg-contain w-full rounded-lg">
            <div className="relative w-full h-full rounded-lg">
              <Image
                src={`/upload/${imageSrc}`}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          onClick={
            !isLocked
              ? (e) =>
                  handleReact(e, {
                    entityId: postId,
                    reactionType: "post",
                    isLike: true,
                  })
              : () => {}
          }
          className="text-muted-foreground"
        >
          <HeartIcon
            className={`mr-1 h-6 w-6 ${
              reactionBefore.liked ? "text-red-500 fill-red-500" : ""
            }`}
          />{" "}
          {liked}
        </Button>
        <Button
          variant="ghost"
          onClick={
            !isLocked
              ? (e) =>
                  handleReact(e, {
                    entityId: postId,
                    reactionType: "post",
                    isLike: false,
                  })
              : () => {}
          }
          size="sm"
          className="text-muted-foreground"
        >
          <HeartCrack
            className={`mr-1 h-6 w-6 ${
              reactionBefore.disliked ? "text-white fill-red-500" : ""
            }`}
          />{" "}
          {disliked}
        </Button>
        <Button
          variant="ghost"
          onClick={handleOpenCommentModal}
          size="sm"
          className="text-muted-foreground"
        >
          <MessageCirclePlus className="mr-1 h-6 w-6" />
          {window.location.pathname != `/` ? comments : ""}
        </Button>
      </CardFooter>
    </Card>
  );
}
