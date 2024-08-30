import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HeartCrack, HeartIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import ProfileButton from "./ProfileLink";

interface PostCardProps {
  author: number;
  username: string;
  firstname: string;
  lastname: string;
  avatarSrc: string;
  date: string;
  title: string;
  content: string;
  imageSrc: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export default function PostCard({
  author,
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
  return (
    <Card className="max-w-2xl mx-auto">
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
      <CardFooter className="flex justify-start pt-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <HeartIcon className="mr-1 h-6 w-6" />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <HeartCrack className="mr-1 h-6 w-6" />
          {dislikes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircleIcon className="mr-1 h-6 w-6" />
          {comments}
        </Button>
      </CardFooter>
    </Card>
  );
}
