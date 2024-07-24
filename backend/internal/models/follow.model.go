package models

type Follow struct {
	Id       int
	Followed *User
	Follower *User
	Archived bool
}
