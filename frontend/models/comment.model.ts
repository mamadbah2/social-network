import { User } from "@/models/user.model";

export interface Comment {
    id: number;
    content: string;
    author?: User;
    createdAt: Date;
}