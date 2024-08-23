import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";

export default function Component() {
  return (
    <Card className="w-[400px] max-w-[95vw] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="/placeholder.svg?height=36&width=36"
              alt="Cherif"
            />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Cherif</p>
            <p className="text-sm text-muted-foreground">01/03/2024</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">
          Create stunning AI videos
        </h2>
        <p className="text-sm text-muted-foreground">
          Create stunning AI videos for free with Haiper AI. Just upload an
          image or type a text prompt to effortlessly create hi-def videos for
          social media, your latest ad campaign, or storyboarding. Sign-up for
          free today!
        </p>
      </CardContent>
      <CardFooter className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Input className="flex-grow" placeholder="Write your comment" />
        <Button size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send comment</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
