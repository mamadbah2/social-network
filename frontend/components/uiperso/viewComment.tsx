import useGetData from "@/lib/hooks/useGet";
import { ReactionOptions, useReaction } from "@/lib/hooks/useReaction";
import { mapReactionType } from "@/lib/modelmapper";
import { Comment } from "@/models/comment.model";
import { Reaction } from "@/models/reaction.model";
import { HeartCrack, HeartIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import ProfileButton from "./ProfileLink";

export default function ViewComment({ comment }: { comment: Comment }) {
  const { handleReactionSubmit, loading, error } = useReaction();
  const [liked, setLiked] = useState(comment.numberLike);
  const [disliked, setDisliked] = useState(comment.numberDislike);
  const [reactionBefore, setReactionBefore] = useState<Reaction>({
    liked: false,
    disliked: false,
  });

  const { expect: initialReaction } = useGetData(
    `/reaction?entityID=${comment.id}&reaction_type=comment`,
    mapReactionType
  );
  useEffect(() => {
    setReactionBefore(initialReaction ?? { liked: false, disliked: false });
  }, [initialReaction]);

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
    <>
      {
        <div className="bg-white shadow-md rounded-xl p-4 max-w-sm mx-auto">
          <div className="flex items-center space-x-3">
            <ProfileButton id={comment.author?.id}>
              <Avatar>
                <AvatarImage
                  src={comment.author?.firstname}
                  alt={comment.author?.firstname}
                />
                <AvatarFallback>
                  {comment.author?.firstname.charAt(0).toUpperCase()}
                  {comment.author?.lastname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ProfileButton>
            <div>
              <h2 className="text-sm font-semibold">
                {comment.author?.firstname}
              </h2>
              <p className="text-xs text-gray-500">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString()
                  : "Unknown Date"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-800">{comment.content}</p>
          {comment.image && (
            <CardContent className="pb-2 max-h-[350px] h-[320px] bg-contain w-full rounded-lg">
              <div className="relative w-full h-full rounded-lg">
                <Image
                  src={`/upload/${comment.image}`}
                  alt={comment.content}
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
                handleReact(e, {
                  entityId: comment.id,
                  reactionType: "comment",
                  isLike: true,
                })
              }
              className="text-muted-foreground"
            >
              <HeartIcon
                className={`mr-1 h-6 w-6 ${
                  reactionBefore.liked ? "text-white fill-red-500" : ""
                }`}
              />
              {liked}
            </Button>
            <Button
              variant="ghost"
              onClick={(e) =>
                handleReact(e, {
                  entityId: comment.id,
                  reactionType: "comment",
                  isLike: false,
                })
              }
              size="sm"
              className="text-muted-foreground"
            >
              <HeartCrack
                className={`mr-1 h-6 w-6 ${
                  reactionBefore.disliked ? "text-white fill-red-500" : ""
                }`}
              />
              {disliked}
            </Button>
          </CardFooter>
        </div>
      }
    </>
  );
}
