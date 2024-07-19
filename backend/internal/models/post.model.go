package models

import "time"

type Post struct {
	Id            int
	Title         string
	Comment       string
	Date          time.Time
	Privacy       string
	Author        *User
	Group         *Group
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	NumberComment int
	Comments      []*Comment
	Viewers       []*User
}
