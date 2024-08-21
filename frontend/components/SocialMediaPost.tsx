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

export default function PostCard() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Cherif" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">Cherif</span>
          <span className="text-sm text-muted-foreground">01/03/2024</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h2 className="text-xl font-bold mb-2">Create stunning AI videos</h2>
        <p className="text-muted-foreground">
          Create stunning AI videos for free with Haiper AI. Just upload an
          image or type a text prompt to effortlessly create hi-def videos for
          social media, your latest ad campaign, or storyboarding. Sign-up for
          free today!
        </p>
      </CardContent>
      <CardContent className="pb-2">
        <Image
          width={500}
          height={300}
          src="/ironman.jpeg"
          alt="AI-generated landscape with mountains and a large moon"
          className="w-full h-auto rounded-lg"
        />
      </CardContent>
      <CardFooter className="flex justify-start pt-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <HeartIcon className="mr-1 h-6 w-6" />
          1.5k
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <RepeatIcon className="mr-1 h-6 w-6" />
          100
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircleIcon className="mr-1 h-6 w-6" />
          1.5k
        </Button>
      </CardFooter>
    </Card>
  );
}
