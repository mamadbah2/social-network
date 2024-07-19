package models

import "time"

type Message struct {
	Id       int
	Comment  string
	Date     time.Time
	Sender   *User
	Receiver *User
}
