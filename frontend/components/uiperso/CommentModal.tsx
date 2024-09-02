import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePostData from "@/lib/hooks/usepost";
import { Send, X } from "lucide-react";
import { FormEvent } from "react";
interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  avatarSrc: string;
  postDate: string;
  postTitle: string;
  postContent: string;
  postId: number;
}
export default function CommentModal({
  isOpen,
  onClose,
  postAuthor,
  avatarSrc,
  postDate,
  postTitle,
  postContent,
  postId,
}: CommentModalProps) {
  if (!isOpen) return null;
  const useHandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const [resp, err] = await usePostData(
      `/comment?Id=${String(postId)}`,
      formData,
      false
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-[95vw] md:max-w-[400px] bg-white shadow-lg rounded-lg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarSrc} alt="Cherif" />
              <AvatarFallback>
                {postAuthor.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{postAuthor}</p>
              <p className="text-sm text-muted-foreground">{postDate}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{postTitle}</h2>

          <p className="text-sm text-muted-foreground max-h-[150px] overflow-y-auto">
            {postContent}
          </p>
        </div>
        <div className="flex items-center space-x-2 p-4 border-t">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <form
            onSubmit={useHandleSubmit}
            className="flex items-center space-x-2 w-full"
            method="post"
          >
            <Input
              className="flex-grow"
              name="CommentContent"
              placeholder="Write your comment"
            />
            <Button size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send comment</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
