package handlers

import (
	"net/http"
	"social-network/internal/models"
	"strconv"

	"github.com/gorilla/websocket"
)

// / This chat box will be used to store online users
var chatbox = make(map[int]*websocket.Conn)

var socket = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// / Chat Handler's responsibilities:
// / Retrieve and Send all messages exchanged with the selected user from the database.
// / Upgrade HTTP protocol to websocket protocol.
// / Add connections to the chatbox.
// / Get messages sent by the current user (Sender) in real-time.
// / Insert the messages in the database's messages table.
// / Find the targeted user (Receiver) in the chat box connection.
// / Send messages to the receiver in real-time.
func (h *Handler) Chat(w http.ResponseWriter, r *http.Request) {
	// Get the sender's ID from the sender's session.
	session, err := h.ConnDB.GetSession(r)
	if err != nil {
		h.Helpers.ServerError(w, err)
		return
	}
	senderID := session.UserId

	// Get the receiver's ID from the request's URL.
	receiverID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		h.Helpers.ClientError(w, http.StatusNotFound)
	}

	// Switching Protocol...
	senderConn, err := socket.Upgrade(w, r, nil)
	if err != nil {
		h.Helpers.ServerError(w, err)
	}
	defer senderConn.Close()

	chatbox[senderID] = senderConn // Add sender's connection in the chat box.

	// Get the message history from the database.
	oldMessages, err := h.ConnDB.Get(
		`SELECT * FROM messages
		WHERE id_sender = ? AND id_receiver = ?
		OR id_receiver = ? AND id_sender = ?`,
		senderID, receiverID, senderID, receiverID,
	)
	if err != nil {
		h.Helpers.ServerError(w, err)
	}

	// Send the message history to the sender.
	if err = senderConn.WriteJSON(oldMessages); err != nil {
		h.Helpers.ServerError(w, err)
		return
	}

	//////////////////////
	/// REAL-TIME CHAT ///
	//////////////////////

	for {
		// Receive new messages from the sender.
		var newMessage models.Message
		if err := senderConn.ReadJSON(&newMessage); err != nil {
			senderConn.Close()
			delete(chatbox, senderID)
			break
		}

		// Insert the new messages in the database.
		h.ConnDB.Set(
			`INSERT INTO messages (id_sender, id_receiver, content, message_type, created_at)
			VALUES (?, ?, ?, ?, ?)`,
			newMessage.SenderID, newMessage.ReceiverID, newMessage.Content, newMessage.Type, newMessage.Date,
		)

		// Send the new messages to the receiver
		// if the receiver has a connection in the chat box.
		if receiverConn, exists := chatbox[receiverID]; exists {
			if err = receiverConn.WriteJSON(newMessage); err != nil {
				receiverConn.Close()
				delete(chatbox, receiverID)
				break
			}
		}
	}
}
