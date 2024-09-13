package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // Autorise toutes les connexions WebSocket
		},
	}
)

type NotifClient struct {
	Conn *websocket.Conn
}

var notifClients = make(map[int]*NotifClient)
var mu sync.RWMutex

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
	senderConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	defer senderConn.Close()

	// Set a read deadline
	// senderConn.SetReadDeadline(time.Now().Add(60 * time.Second))
	mu.Lock()
	notifClients[senderID] = &NotifClient{Conn: senderConn} // Add sender's connection.
	mu.Unlock()
	fmt.Println("notifClients =>>", notifClients)

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
		}

		if newNotif.Approuved {
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
		}

		// Verrouiller la lecture de la map
		mu.RLock()
		receiverConn, exists := notifClients[newNotif.Receiver.Id]
		mu.RUnlock()
		if exists {
			hand.Helpers.InfoLog.Println("newNotif =>>", newNotif)
			if err = receiverConn.Conn.WriteJSON(newNotif); err != nil {
				hand.Helpers.ErrorLog.Println("Erreur d'écriture JSON : ", err)

				// Vérifier si la connexion est fermée
				if err == websocket.ErrCloseSent || websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					mu.Lock()
					delete(notifClients, newNotif.Receiver.Id)
					mu.Unlock()
					
					hand.Helpers.InfoLog.Printf("Connexion fermée pour l'utilisateur %d\n", newNotif.Receiver.Id)
				}
				return
			}
		}

	}
}
