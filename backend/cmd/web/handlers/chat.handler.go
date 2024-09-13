package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"sync"

	"github.com/gorilla/websocket"
)

// / This chat box will be used to store online users
var chatbox = make(map[int]*websocket.Conn)
var chatboxMutex sync.Mutex

var socket = websocket.Upgrader{
	ReadBufferSize:  2048,
	WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) Chat(w http.ResponseWriter, r *http.Request) {
	// Get the sender's ID from the sender's session.
	session, err := h.ConnDB.GetSession(r)
	if err != nil {
		h.Helpers.ServerError(w, err)
		return
	}
	senderID := session.UserId

	// Switching Protocol...
	senderConn, err := socket.Upgrade(w, r, nil)
	if err != nil {
		h.Helpers.ServerError(w, err)
		return
	}
	defer senderConn.Close()

	chatboxMutex.Lock()
	chatbox[senderID] = senderConn
	chatboxMutex.Unlock()
	//////////////////////
	/// REAL-TIME CHAT ///
	//////////////////////

	var messages []*models.Message
	for {
		// Receive new messages from the sender.
		var newMessage *models.Message
		var receivers []*models.User
		// var strMsg string
		if err := senderConn.ReadJSON(&newMessage); err != nil {
			senderConn.Close()
			chatboxMutex.Lock()
			delete(chatbox, senderID)
			chatboxMutex.Unlock()
			break
		}

		switch newMessage.Type {
		case "getAllMessagePrivate":

			fmt.Println("getAllMessagePrivate")
			oldMsg, err := h.ConnDB.GetOldConversation(newMessage.Sender.Id, newMessage.Receiver.Id, "private")
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}

			// Define the receiver
			r, err := h.ConnDB.GetUser(newMessage.Receiver.Id)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			receivers = []*models.User{r}

			// If there is no old message, we add the new message to the messages slice.
			if len(oldMsg) == 0 {
				messages = []*models.Message{newMessage}
			} else {
				messages = oldMsg
			}
		case "getAllMessageGroup":
			fmt.Println("getAllMessageGroup")
			fmt.Println("newMessage r - s: ", newMessage.Receiver.Id, "-", newMessage.Sender.Id)
			oldMsg, err := h.ConnDB.GetOldConversation(newMessage.Sender.Id, newMessage.Receiver.Id, "group")
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			// Define the receivers
			group, err := h.ConnDB.GetGroup(newMessage.Receiver.Id)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			receivers = group.Members

			if len(oldMsg) == 0 {
				messages = []*models.Message{newMessage}
			} else {
				fmt.Println("oldMsg: ", oldMsg)
				messages = oldMsg
			}
		case "private":
			fmt.Println("private")
			// Save the new message in the database.
			_, err = h.ConnDB.SaveMessage(newMessage)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}

			// Define the receiver
			r, err := h.ConnDB.GetUser(newMessage.Receiver.Id)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			receivers = []*models.User{r}

			messages = []*models.Message{newMessage}
		case "group":
			fmt.Println("group")
			// Save the new message in the database.
			_, err = h.ConnDB.SaveMessage(newMessage)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			// Define the receivers
			group, err := h.ConnDB.GetGroup(newMessage.Receiver.Id)
			if err != nil {
				h.Helpers.ServerError(w, err)
				return
			}
			receivers = group.Members

			messages = []*models.Message{newMessage}
		}
		for _, receiver := range receivers {
			// Send the new messages to the receiver if the receiver is online and not the sender.
			if receiver.Id == newMessage.Sender.Id && newMessage.Type != "getAllMessageGroup" {
				continue
			}
			chatboxMutex.Lock()
			receiverConn, exists := chatbox[receiver.Id]
			chatboxMutex.Unlock()

			if exists {
				if err = receiverConn.WriteJSON(messages); err != nil {
					receiverConn.Close()
					chatboxMutex.Lock()
					delete(chatbox, newMessage.Receiver.Id)
					chatboxMutex.Unlock()
					break
				}
			}

		}
	}
}
