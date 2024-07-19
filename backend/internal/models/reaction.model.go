package models

type Reaction struct {
	Id       int
	Liked    bool
	Disliked bool
	Post     *Post
	Comment  *Comment
	Author   *User
}
