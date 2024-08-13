package models

import "time"

type Notification struct {
	Id         int
	EntityType string // exple message, event, follow, rejoin group
	EntityID   int // là ce sera id de l'entité considéré
	Seen       bool
	CreatedAt  time.Time
	SenderID   *User
	ReceiverID *User
}
