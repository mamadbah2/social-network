import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HeartIcon, MessageCircleIcon, RepeatIcon } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  username: string;
  avatarSrc: string;
  date: string;
  title: string;
  content: string;
  imageSrc: string;
  likes: number;
  shares: number;
  comments: number;
}

export default function PostCard({
  username,
  avatarSrc,
  date,
  title,
  content,
  imageSrc,
  likes,
  shares,
  comments,
}: PostCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{username}</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
      <CardContent className="pb-2 h-[300px]">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain rounded-lg"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-start pt-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <HeartIcon className="mr-1 h-6 w-6" />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <RepeatIcon className="mr-1 h-6 w-6" />
          {shares}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircleIcon className="mr-1 h-6 w-6" />
          {comments}
        </Button>
      </CardFooter>
    </Card>
  );
}
