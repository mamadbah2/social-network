package handlers

import (
	"fmt"
	"net/http"
)

func (hand *Handler) Session(w http.ResponseWriter, r *http.Request) {
	session, err := hand.ConnDB.GetSession(r)
	fmt.Println("session", session)
	fmt.Println("err", err)
	if err != nil || session == nil {
		hand.Valid.AddFieldError("session", "not-found")
		hand.renderJSON(w, nil)
		return
	}
	hand.renderJSON(w, session)
}
