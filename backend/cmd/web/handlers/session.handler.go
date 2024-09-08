package handlers

import (
	"net/http"
)

func (hand *Handler) Session(w http.ResponseWriter, r *http.Request) {
	session, err := hand.ConnDB.GetSession(r)
	if err != nil || session == nil {
		hand.Valid.AddFieldError("session", "not-found")
		hand.renderJSON(w, nil)
		return
	}
	hand.renderJSON(w, session)
}
