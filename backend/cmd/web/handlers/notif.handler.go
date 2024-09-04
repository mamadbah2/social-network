package handlers

import "net/http"

func (hand *Handler) Notif(w http.ResponseWriter, r *http.Request) {
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	actualUser, err := hand.ConnDB.GetUser(session.UserId)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	if r.Method == http.MethodGet {
		// Get all notifications
		notifs, err := hand.ConnDB.GetNotifications(actualUser.Id)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}
		hand.renderJSON(w, notifs)
	}
}
