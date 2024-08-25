import { User } from "@/models/user.model"

export interface Group {
    id :          number
	name    :    string
	description :string
	creator    ?: User
	createdAt  : Date
}