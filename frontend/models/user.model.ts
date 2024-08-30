import { Group } from "./group.model";
import { Post } from "./post.model";

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  dateOfBirth: Date;
  aboutMe: string;
  private: boolean;
  profilePicture: string;
  groups?: Group[];
  createdGroups?: Group[];
  suggestedFriends?: User[];
  posts?: Post[];
  followers?: User[];
  followed?: User[];
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
