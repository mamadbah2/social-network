package models

import "time"

type Message struct {
	Id       int
	Comment  string
	Message_type string
	Date     time.Time
	Sender   *User
	Receiver *User
}
