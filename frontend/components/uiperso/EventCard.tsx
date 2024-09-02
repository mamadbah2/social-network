import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

interface EventCardProps {
  username: string;
  avatarSrc: string;
  date: string;
  time: string;
  title: string;
  description: string;
  imageSrc?: string; // optional, in case there's no image
  onJoin: () => void;
  onDismiss: () => void;
}

export default function EventCard({
  username,
  avatarSrc,
  date,
  time,
  title,
  description,
  imageSrc,
  onJoin,
  onDismiss,
}: EventCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{username}</span>
          <span className="text-sm text-muted-foreground">{date} at {time}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      {imageSrc && (
        <CardContent className="pb-2 h-[280px]">
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-start pt-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onJoin}>
          Join
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onDismiss}>
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  );
}