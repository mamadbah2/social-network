package handlers

import (
	"net/http"
)

func (hand *Handler) Users(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
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
	// Ce handler n'est fetchable qu'en methode Get vu le register
	switch r.Method {
	case http.MethodGet:

		users, err := hand.ConnDB.GetUser(actualUser.Id)
		if err != nil {
			hand.Helpers.ServerError(w, err)
		}

		hand.renderJSON(w, users)
	}
}
