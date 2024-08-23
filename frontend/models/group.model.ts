import { User } from "@/models/user.model"

export interface Group {
    Id :          number
	Name    :    string
	Description :string
	Creator    : User
	CreatedAt  : Date
}