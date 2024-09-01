import { User } from "@/models/user.model"
import { Post } from "./post.model"
import { Event } from "./event.model"

export interface Group {
    id :          number
	name    :    string
	description :string
	creator    ?: User
	createdAt  : Date
	posts: Post[];
	members: User[];
	events: Event[];
}
