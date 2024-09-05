import { useReaction } from "@/lib/hooks/useReaction";
import { Comment } from "@/models/comment.model";
import { HeartCrack, HeartIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import ProfileButton from "./ProfileLink";

export default function ViewComment({
  comments,
}: {
  comments: Comment[] | undefined;
}) {
  const { handleReactionSubmit, loading, error } = useReaction();

  return (
    <>
      {comments?.map((comment) => (
        <div
          key={comment.id}
          className="bg-white shadow-md rounded-xl p-4 max-w-sm mx-auto"
        >
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
          <CardFooter className="flex justify-start pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) =>
                handleReactionSubmit(e, {
                  entityId: comment.id,
                  reactionType: "comment",
                  isLike: true,
                })
              }
              className="text-muted-foreground"
            >
              <HeartIcon className="mr-1 h-6 w-6" />
              {comment.numberDislike}
            </Button>
            <Button
              variant="ghost"
              onClick={(e) =>
                handleReactionSubmit(e, {
                  entityId: comment.id,
                  reactionType: "comment",
                  isLike: false,
                })
              }
              size="sm"
              className="text-muted-foreground"
            >
              <HeartCrack className="mr-1 h-6 w-6" />
              {comment.numberDislike}
            </Button>
          </CardFooter>
        </div>
      ))}
    </>
  );
}
