package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"

	"github.com/gorilla/websocket"
)

var notifClients = make(map[int]*websocket.Conn)

// It's really same chat box

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

	notifClients[senderID] = senderConn // Add sender's connection.
	fmt.Println("notifClients : >>", notifClients)
	
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
			hand.Helpers.ErrorLog.Println("error ReadJSON : ", err)
			return
			// senderConn.Close()
			// delete(notifClients, senderID)
			// break
		}

		if newNotif.Approuved == true {
			err := hand.ConnDB.ArchivedNotification(newNotif.Id)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}
		} else {
			id, err := hand.ConnDB.SetNotification(newNotif)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}

			// Completion des champs users
			newNotif.Id = id
			if newNotif.Sender, err = hand.ConnDB.GetUser(newNotif.Sender.Id); err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			if newNotif.Receiver, err = hand.ConnDB.GetUser(newNotif.Receiver.Id); err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}

			// Send the new messages to the receiver
			// if the receiver has a connection in the chat box.
			if receiverConn, exists := notifClients[newNotif.Receiver.Id]; exists {
				if err = receiverConn.WriteJSON(newNotif); err != nil {
					hand.Helpers.ErrorLog.Println("error Write JSON : ", err)
					return
					// receiverConn.Close()
					// delete(notifClients, newNotif.Receiver.Id)
					// break
				}
			}
		}

	}
}
