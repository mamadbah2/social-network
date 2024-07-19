package models

type Group struct {
	Id          int
	Name        string
	Description string
	IdCreator   int
	Posts       []*Post
	Members     []*User
}
