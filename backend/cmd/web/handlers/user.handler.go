package handlers

import "net/http"

func (hand *Handler) Users(w http.ResponseWriter, r *http.Request) {
	// Ici logique verification session

	// Ce handler n'est fetchable qu'en methode Get vu le register
	switch r.Method {
	case http.MethodGet:

		users, err := hand.ConnDB.GetAllUsers()
		if err != nil {
			hand.Helpers.ServerError(w, err)
		}

		hand.renderJSON(w, users)
	}
}
