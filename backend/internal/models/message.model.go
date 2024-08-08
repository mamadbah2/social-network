package models

type Message struct {
	Id         int
	Content    string `json:"content"`
	Type       string `json:"type"`
	SenderID   int    `json:"senderID"`
	ReceiverID int    `json:"receiverID"`
	Date       string `json:"date"`
}
