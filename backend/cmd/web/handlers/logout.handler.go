package handlers

import (
	"net/http"
	"social-network/cmd/web/sessionManager"
)

type contextKey string

const sessionKey contextKey = "session"

func (hand *Handler) UserLogoutPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}
	session, ok := r.Context().Value(sessionKey).(*sessionManager.Session)
	if !ok || session == nil {
		return
	}
	hand.SessionManager.DeleteSession(session.Id)
	cookie := http.Cookie{
		Name:     "session",
		Value:    session.Id,
		MaxAge:   -1,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	}

	http.SetCookie(w, &cookie)
}