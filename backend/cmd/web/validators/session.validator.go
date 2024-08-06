package validators

import (
	"fmt"
	"net/http"
)

func (v *Validator) ValidSession(r *http.Request) (int, error) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return 0, err
	}
	if cookie.Value == "" {
		return 0, fmt.Errorf("validSession() : cookie don't contain value")
	}

	// verify if the user didn't logged in
	// on another browser
	userId := 12
	return userId, nil
}
