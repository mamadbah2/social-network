package models

import "time"

// Ceci n'est pas un model officiel mais un exemple

type User struct {
	Id             int
	Email          string
	FirstName      string
	LastName       string
	Nickname       string
	DateOfBirth    time.Time
	ProfilePicture string
	AboutMe        string
	Private        bool
	Followers      []*User
	Groups         []*Group
	Posts          []*Post
}

func (m *ConnDB) GetUser(id int) (*User, error) {

	return nil, nil
}
