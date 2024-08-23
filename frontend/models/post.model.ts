import { User } from "./user.model";

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    privacy: string;
    liked: boolean;
    disliked: boolean;
    numberLike: number;
    numberDislike: number;
    numberComment: number;
    author?: User// Optional array of comments
    viewers?: User[];      // Optional array of viewers
}
