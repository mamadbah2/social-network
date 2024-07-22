package models

import "time"

type Group struct {
	Id          int
	Name        string
	Description string
	Creator    	*User
	CreatedAt	time.Time
	Posts       []*Post
	Members     []*User
}
