package handlers

import (
	"net/http"
	"social-network/internal/models"

	"github.com/gorilla/websocket"
)

var notifClients = make(map[int]*websocket.Conn)

func (hand *Handler) Notification(w http.ResponseWriter, r *http.Request) {
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	// h.Helpers.ErrorLog.Fatalln("session. =>>", session)
	senderID := session.UserId

	// Switching Protocol...
	senderConn, err := socket.Upgrade(w, r, nil)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	defer senderConn.Close()

	notifClients[senderID] = senderConn // Add sender's connection in the chat box.

	// Get the message history from the database.
	myNotifs, err := hand.ConnDB.GetNotifications(senderID)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	// Send the message history to the sender.
	if err = senderConn.WriteJSON(myNotifs); err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	for {
		// Receive a new notif
		var newNotif *models.Notification
		// var strMsg string
		if err := senderConn.ReadJSON(&newNotif); err != nil {
			senderConn.Close()
			delete(notifClients, senderID)
			break
		}

		if newNotif.Approuved == true {
			err := hand.ConnDB.ArchivedNotification(newNotif.Id)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}
		} else {
			_, err := hand.ConnDB.SetNotification(newNotif)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}
			// Send the new messages to the receiver
			// if the receiver has a connection in the chat box.
			if receiverConn, exists := notifClients[newNotif.ReceiverID]; exists {
				if err = receiverConn.WriteJSON(newNotif); err != nil {
					receiverConn.Close()
					delete(notifClients, newNotif.ReceiverID)
					break
				}
			}
		}

	}
}
