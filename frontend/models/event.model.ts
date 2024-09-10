import { Group } from "./group.model"
import { User } from "./user.model"

export interface Event {
    Id : number
	Title : string
	Description : string
	Date : string
	Time : string
	Liked : boolean
	Disliked : boolean
	NumberLike : number
	NumberDislike : number
	Creator : User
	Group : Group
}