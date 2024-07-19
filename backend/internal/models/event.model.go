package models

import "time"

type Event struct {
	Id          int
	Title       string
	Description string
	Date        time.Time
	Creator     *User
	Group       *Group
}
