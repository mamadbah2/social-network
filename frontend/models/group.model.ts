import { User } from "@/models/user.model"
import { Post } from "./post.model"
import { Event } from "./event.model"

export interface Group {
    Id :          number
	Name    :    string
	Description :string
	Creator    ?: User
	CreatedAt  : Date
	Posts: Post[];
	Members: User[];
	Events: Event[];
}
