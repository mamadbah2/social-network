import { User } from "@/models/user.model";
import { Post } from "./post.model";

export interface Comment {
  id: number;
  content: string;
  image?: string;
  createdAt: Date;
  liked: boolean;
  disliked: boolean;
  numberLike: number;
  numberDislike: number;
  post?: Post;
  author?: User;
}
