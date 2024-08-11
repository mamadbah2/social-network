package handlers

import (
	"errors"
	"net/http"
	"social-network/cmd/web/validators"
)

/*
	 type userLoginForm struct {
		EmailOrUsername string
		Password        string
	}
*/
func (hand *Handler) Login(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}
	
	err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	err = r.ParseForm()
	if err != nil {
		w.WriteHeader(400)
		return
	}

	EmailOrUsername := r.PostForm.Get("email_nickname")
	Password := r.PostForm.Get("password")

	hand.Valid.CheckField(validators.NotBlank(EmailOrUsername), "email", "This field cannot be blank")
	hand.Valid.CheckField(validators.Matches(EmailOrUsername, validators.EmailRX), "email", "This field must be a valid email address")
	hand.Valid.CheckField(validators.NotBlank(Password), "password", "This field cannot be blank")
	if !hand.Valid.Valid() {
		hand.Helpers.ErrorLog.Println(hand.Valid.FieldErrors)
		hand.renderJSON(w, nil)
	}

	id, err := hand.ConnDB.Authenticate(EmailOrUsername, Password)
	if err != nil {
		if errors.Is(err, errors.New("models: invalid credentials")) {
			hand.Valid.AddNonFieldError("credentials is incorrect")
			return
		} else {
			w.WriteHeader(500)
			return
		}
	}

	existingSession, err := hand.ConnDB.GetActiveSession(id)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	// If the session exists, we delete it
	if existingSession != nil {
		err := hand.ConnDB.DeleteSession(existingSession.Id)
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
	}

	_, err = hand.SessionManager.NewSession(w, id)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	hand.renderJSON(w, id)
}
