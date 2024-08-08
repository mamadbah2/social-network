package handlers

import (
	"log"
	"net/http"
	"social-network/cmd/web/sessionManager"
	"social-network/internal/models"

	"github.com/gorilla/websocket"
)

var chatBox = make(map[*websocket.Conn]int)

var socket = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var sessionKey interface{}

func (h *Handler) Chat(w http.ResponseWriter, r *http.Request) {
	conn, err := socket.Upgrade(w, r, nil)
	if err != nil {
		h.Helpers.ServerError(w, err)
	}
	defer conn.Close()

	if session, ok := r.Context().Value(sessionKey).(*sessionManager.Session); ok {
		chatBox[conn] = session.UserId
	}

	for {
		var msg models.Message
		if err := conn.ReadJSON(&msg); err != nil {
			log.Println("ERROR -> ", err)
			delete(chatBox, conn)
			break
		}

		h.ConnDB.Set(
			`INSERT INTO messages (id_sender, id_receiver, content, message_type, created_at)
			VALUES (?, ?, ?, ?, ?)`,
			msg.SenderID, msg.ReceiverID, msg.Content, msg.Type, msg.Date,
		)

		for conn, id := range chatBox {
			if id != msg.ReceiverID || id != msg.SenderID {
				continue
			}

			if err = conn.WriteJSON(msg); err != nil {
				conn.Close()
				delete(chatBox, conn)
				break
			}
		}
	}
}
