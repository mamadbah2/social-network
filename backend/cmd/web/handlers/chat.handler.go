package handlers

import (
	"log"
	"net/http"
	"social-network/cmd/web/sessionManager"
	"social-network/internal/models"
	"strconv"

	"github.com/gorilla/websocket"
)

// / This chat box will be used to store online users
var chatBox = make(map[*websocket.Conn]int)

var socket = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var sessionKey interface{} // TODO: Find the Source...

// / The Chat handler is responsible for:
// / Retrieving the messages exchange with a user from the database.
// / Upgrading HTTP protocol to websocket protocol.
// / Adding connections to the chat box.
// / Receiving incoming messages from a sender in the chat box connection in real-time.
// / Inserting incoming messages in the database messages table.
// / Sending messages to a receiver in the chat box connection in real-time.
func (h *Handler) Chat(w http.ResponseWriter, r *http.Request) {
	// Get the receiver from the client.
	receiverID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		h.Helpers.ClientError(w, http.StatusNotFound)
	}

	// Get the sender from the session.
	session, ok := r.Context().Value(sessionKey).(*sessionManager.Session)
	if !ok {
		h.Helpers.ClientError(w, http.StatusForbidden)
	}

	// Get the conversion's messages from the database.
	senderID := session.UserId
	messages, err := h.ConnDB.Get(
		`SELECT * FROM messages
		WHERE id_sender = ? AND id_receiver = ?
		OR id_receiver = ? AND id_sender = ?`,
		senderID, receiverID, senderID, receiverID,
	)
	if err != nil {
		h.Helpers.ServerError(w, err)
	}
	h.renderJSON(w, messages) // Send back to the client

	//////////////////////
	/// Real-Time Chat ///
	//////////////////////

	conn, err := socket.Upgrade(w, r, nil) // Upgrading...
	if err != nil {
		h.Helpers.ServerError(w, err)
	}
	defer conn.Close()

	chatBox[conn] = senderID // Adding...

	for {
		var msg models.Message
		if err := conn.ReadJSON(&msg); err != nil { // Receiving...
			log.Println("ERROR -> ", err)
			delete(chatBox, conn)
			break
		}

		h.ConnDB.Set( // Inserting...
			`INSERT INTO messages (id_sender, id_receiver, content, message_type, created_at)
			VALUES (?, ?, ?, ?, ?)`,
			msg.SenderID, msg.ReceiverID, msg.Content, msg.Type, msg.Date,
		)

		for conn, id := range chatBox { // Find the receiver in the chat box.
			if id == msg.ReceiverID {
				err = conn.WriteJSON(msg) // Sending...
				if err != nil {
					conn.Close()
					delete(chatBox, conn)
					break
				}
			}
		}
	}
}
