package handlers

import (
	"net/http"
)


func (hand *Handler) UserLogoutPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	hand.ConnDB.DeleteSession(session.Id)
	cookie := http.Cookie{
		Name:     "session",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	}

	http.SetCookie(w, &cookie)
}