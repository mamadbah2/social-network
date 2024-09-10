import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ClockIcon } from "lucide-react"; // Use your preferred clock icon
import Image from "next/image";
import Link from "next/link"; // For the 'View Description' link
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormEvent, useEffect, useState } from "react";
import { ReactionOptions, useReaction } from "@/lib/hooks/useReaction";
import { usePostContext } from "@/lib/hooks/postctx";
import { Reaction } from "@/models/reaction.model";
import useGetData from "@/lib/hooks/useGet";
import { mapReactionType } from "@/lib/modelmapper";

interface EventCardProps {
  username: string;
  eventID: string;
  userID: string;
  avatarSrc: string;
  date: string; // Date should be parsed as day, month, year separately
  time: string;
  likes: number;
  dislikes: number;
  title: string;
  description: string;
  imageSrc?: string; // optional, in case there's no image
  onJoin: () => void;
  onDismiss: () => void;
}

export default function EventCard({
  username,
  eventID,
  userID,
  avatarSrc,
  date,
  time,
  likes,
  dislikes,
  title,
  description,
  imageSrc,
  onJoin,
  onDismiss,
}: EventCardProps) {

  const eventDate = new Date(date); // You can parse the date string
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString("default", { month: "short" });
  const year = eventDate.getFullYear();

  const [liked, setLiked] = useState(likes);
  const [disliked, setDisliked] = useState(dislikes);
  const { handleReactionSubmit, loading, error } = useReaction();
  const {incrementComment, setIncrementComment}  = usePostContext();
  
  const [reactionBefore, setReactionBefore] = useState<Reaction>({
    liked: false,
    disliked: false,
  });
  
  const {expect: initialReaction} = useGetData(`/reaction?entityID=${eventID}&reaction_type=post`, mapReactionType);
  useEffect(() => {
    setReactionBefore(initialReaction ?? {liked: false, disliked: false});
  }, [initialReaction])

/*   useEffect(() => {
    if (incrementComment) {
      comments = comments + 1;
      setIncrementComment(false);
    }   
  },[incrementComment]); */

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
    <Card className="max-w-xl mx-auto p-4 flex gap-5">
      <div className="flex items-center gap-4">
        {/* Date box */}
        <div className="flex flex-col items-center bg-gray-800 text-white rounded-lg w-16 h-20 justify-center p-11">
          <span className="text-lg font-semibold">{month}</span>
          <span className="text-3xl font-bold">{day}</span>
          <span className="text-sm">{year}</span>
        </div>
      </div>
      {/* Event details */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Dialog>
          <DialogTrigger asChild>
            <button>View Description</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
                {description}
          </DialogContent>
        </Dialog>
        </div>
        <div className="flex-1">
          <div className="flex items-center text-gray-500 text-sm gap-2 mt-1">
            <ClockIcon size={16} />
            <span>{time}</span>
          </div>
        </div>

        {/* Description Modal */}
        {/* Optional Image */}
        {imageSrc && (
          <CardContent className="pb-2 h-[200px]">
            <div className="relative w-full h-full mt-4">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CardContent>
        )}

        {/* Buttons */}
        <CardFooter className="flex justify-start gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-black text-white"
            onClick={(e) =>
              handleReact(e, {
                entityId: +eventID,
                reactionType: "event",
                isLike: true,
              })
            }
          >
            Going {liked}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600"
            onClick={(e) =>
              handleReact(e, {
                entityId: +eventID,
                reactionType: "event",
                isLike: false,
              })
            }
          >
            Not Going {disliked}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}