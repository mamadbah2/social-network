package handlers

import (
	"fmt"
	"net/http"
)

func (hand *Handler) UserLogoutPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	fmt.Println("******** Session", session)
	hand.ConnDB.DeleteSession(session.Id)
	cookie := http.Cookie{
		Name:     "session",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	}
	session.Cookie = &cookie
	hand.renderJSON(w, session)
	http.SetCookie(w, &cookie)
}
