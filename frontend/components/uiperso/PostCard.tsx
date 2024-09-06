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
import { FormEvent, useState } from "react";
import CommentModal from "./CommentModal";
import ProfileButton from "./ProfileLink";
import useGetData from "@/lib/hooks/useGet";

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
  const [reactionBefore, setReactionBefore] = useState<Reaction>({
    liked: false,
    disliked: false,
  });
  // Les condition ci dessous fonctionne bien... mais maintenant
  // J'ai besoin de récupérer les réactions initial de l'utilisateur pour savoir si il a déjà réagit à ce post
  // J'ai donc pensé a faire une methode get pour recuperer la reaction du user suivant l'id du post
  // Pour ça il faudra un tout petit peu modifier le backend et apres on est bon 
  // Pour l'instant je vais à la mosque
  const {expect: initialReaction} = useGetData(`/reactions`)


  const handleReact = (
    e: FormEvent<HTMLButtonElement>,
    { entityId, reactionType, isLike }: ReactionOptions
  ) => {
    handleReactionSubmit(e, {
      entityId: entityId,
      reactionType: reactionType,
      isLike: isLike,
    }).then((resp) => {
      console.log("resp :>> ", resp);
      console.log('reactionBefore :>> ', reactionBefore);
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
          setLiked((prev) => prev + 1);
        } else if (reactionBefore.disliked) {
          setDisliked((prev) => prev + 1);
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
          {comments}
        </Button>
      </CardFooter>
    </Card>
  );
}
