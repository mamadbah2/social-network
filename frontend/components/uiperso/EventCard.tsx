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

interface EventCardProps {
  username: string;
  avatarSrc: string;
  date: string; // Date should be parsed as day, month, year separately
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
  const eventDate = new Date(date); // You can parse the date string
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString("default", { month: "short" });
  const year = eventDate.getFullYear();

  return (
    <Card className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-4">
        {/* Date box */}
        <div className="flex flex-col items-center bg-gray-200 text-black rounded-lg w-16 h-20 justify-center">
          <span className="text-lg font-semibold">{month}</span>
          <span className="text-3xl font-bold">{day}</span>
          <span className="text-sm">{year}</span>
        </div>

        {/* Event details */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Link href="#" className="text-sm text-blue-600">
              View Description
            </Link>
          </div>
          <div className="flex items-center text-gray-500 text-sm gap-2 mt-1">
            <ClockIcon size={16} />
            <span>{time}</span>
          </div>
        </div>
      </div>

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
        <Button variant="solid" size="sm" className="bg-black text-white" onClick={onJoin}>
          Going
        </Button>
        <Button variant="outline" size="sm" className="border-gray-300 text-gray-600" onClick={onDismiss}>
          Not Going
        </Button>
      </CardFooter>
    </Card>
  );
}
