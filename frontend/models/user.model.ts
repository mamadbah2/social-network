import { Group } from "./group.model"

export interface User {
    Id: number
    email: string
    firstname: string
    lastname: string
    nickname: string
    dateOfBirth: Date
    aboutMe: string
    private: boolean
    groups?: Group[]
    createdGroups?: Group[]
}

// Id             int
// 	Email          string
// 	Password       string
// 	FirstName      string
// 	LastName       string
// 	Nickname       string
// 	DateOfBirth    time.Time
// 	ProfilePicture string
// 	AboutMe        string
// 	Private        bool