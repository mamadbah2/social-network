import { Comment } from "@/models/comment.model";
import { Group } from "@/models/group.model";
import { User } from "@/models/user.model";

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  privacy: string;
  imageName: string;
  liked: boolean;
  disliked: boolean;
  numberLike: number;
  numberDislike: number;
  numberComment: number;
  imageSrc?: string;
  author?: User; // Optional field for the author
  group?: Group; // Optional field for the group
  comments?: Comment[]; // Optional array of comments
  viewers?: User[]; // Optional array of viewers
}
