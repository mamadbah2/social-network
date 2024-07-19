package models

import "time"

type Comment struct {
	Id            int
	Content       string
	Date          time.Time
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	Post          *Post
	Author        *User
}
