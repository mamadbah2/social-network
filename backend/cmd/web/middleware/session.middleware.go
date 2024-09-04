package middleware

import (
	"net/http"
)

type contextKey string

const SessionKey contextKey = "session"

func (m *Middleware) Authenticate(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := m.ConnDB.GetSession(r)
		if err != nil || session == nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		next.ServeHTTP(w, r)
	})
}

/* func (m *Middleware) CheckSessionExpiration(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, ok := r.Context().Value(SessionKey).(*models.Session)
		if !ok || session == nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		if time.Now().After(session.Expired_at) {
			err := m.ConnDB.DeleteSession(session.Id)
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

			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		next.ServeHTTP(w, r)
	})
} */
