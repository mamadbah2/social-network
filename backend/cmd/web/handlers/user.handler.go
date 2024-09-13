package handlers

import (
	"net/http"
	"strconv"
)

func (hand *Handler) Users(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	/* session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	actualUser, err := hand.ConnDB.GetUser(session.UserId)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	} */
	
	// Ce handler n'est fetchable qu'en methode Get vu le register
	switch r.Method {
	case http.MethodGet:

		query := r.URL.Query()

		if query.Has("id") {

			id, err := strconv.Atoi(query.Get("id"))
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}

			user, err := hand.ConnDB.GetUser(id)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(w, user)

		} else {
			users, err := hand.ConnDB.GetAllUsers()
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			
			hand.renderJSON(w, users)
		}

	case http.MethodPost:
		query := r.URL.Query()
		if query.Has("id") {
			id, err := strconv.Atoi(query.Get("id"))
			if err != nil {
							hand.Helpers.ClientError(w, http.StatusBadRequest)
							return
			}
			isPrivate := false
			if r.PostForm.Get("updatePrivacy") == "public" {
							isPrivate = false
			} else {
							isPrivate = true
			}
			err = hand.ConnDB.UpdatePofilePrivacy(id, isPrivate)
			if err != nil {
							hand.Helpers.ServerError(w, err)
							return
			}
			user, err := hand.ConnDB.GetUser(id)
			if err != nil {
							hand.Helpers.ServerError(w, err)
							return
			}
			hand.renderJSON(w, user)
		}else{
			hand.renderJSON(w, nil)
		}
	}
}
