package middleware

import (
	"context"
	"net/http"
	"social-network/cmd/web/sessionManager"
	"time"
)


type contextKey string

const sessionKey contextKey = "session"

func (m *Middleware) LoadAndSave(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := m.SessionManager.GetSession(r)
		if err != nil {
			w.WriteHeader(500)
			return
		}

		if session == nil {
			handler.ServeHTTP(w, r)
			return
		}
		if time.Now().After(session.Expired_at) {
			err := m.SessionManager.DeleteSession(session.Id)
			if err != nil {
				w.WriteHeader(500)
				return
			}
			cookie := http.Cookie{
				Name:     "session",
				Value:   "",
				MaxAge:   -1,
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
			}

			http.SetCookie(w, &cookie)
			http.Redirect(w, r, "/user/login", http.StatusSeeOther)
			return
		}

		ctx := context.WithValue(r.Context(), sessionKey, session)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *Middleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, ok := r.Context().Value(sessionKey).(*sessionManager.Session)
		if !ok || session == nil {
			http.Redirect(w, r, "/user/login", http.StatusSeeOther)
			return
		}
		if time.Now().After(session.Expired_at) {
			err := m.SessionManager.DeleteSession(session.Id)
			if err != nil {
				w.WriteHeader(500)
				return
			}
			cookie := http.Cookie{
				Name:     "session",
				Value:    "",
				MaxAge:   -1,
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
			}

			http.SetCookie(w, &cookie)
			http.Redirect(w, r, "/user/login", http.StatusSeeOther)
			return
		}
		session.Expired_at = time.Now().Add(30 * time.Minute)
		session.Cookie.Expires = time.Now().Add(30 * time.Minute)

		next.ServeHTTP(w, r)
	})
}

func (m *Middleware) CheckSessionExpiration(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, ok := r.Context().Value(sessionKey).(*sessionManager.Session)
		if !ok || session == nil {
			http.Redirect(w, r, "/user/login", http.StatusSeeOther)
			return
		}

		if time.Now().After(session.Expired_at) {
			err := m.SessionManager.DeleteSession(session.Id)
			if err != nil {
				w.WriteHeader(500)
				return
			}
			cookie := http.Cookie{
				Name:     "session",
				Value:    "",
				MaxAge:   -1,
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
			}

			http.SetCookie(w, &cookie)

			http.Redirect(w, r, "/user/login", http.StatusSeeOther)
			return
		}

		next.ServeHTTP(w, r)
	})
}