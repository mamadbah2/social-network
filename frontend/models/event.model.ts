import { Group } from "./group.model"
import { User } from "./user.model"

export interface Event {
    id : number
	title : string
	date  : Date
	description :string
	creator? : User
	group : Group
}