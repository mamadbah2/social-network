package handlers

import (
	"net/http"
	"social-network/cmd/web/validators"
)

func (hand *Handler) Login(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(400)
		return
	}
	EmailOrUsername := r.PostForm.Get("emailNickname")
	Password := r.PostForm.Get("password")	
	
	hand.Valid.CheckField(validators.NotBlank(EmailOrUsername), "email", "This field cannot be blank")
	hand.Valid.CheckField(validators.NotBlank(Password), "password", "This field cannot be blank")
	if !hand.Valid.Valid() {
		hand.renderJSON(w, nil)
		return
	}

	id, err := hand.ConnDB.Authenticate(EmailOrUsername, Password)
	if err != nil {
		if err.Error() == "models: invalid credentials" {
			hand.Valid.AddFieldError("email/password", "credentials is incorrect")
			hand.renderJSON(w, nil)
			return
		} else {
			hand.Helpers.ServerError(w, err)
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
			hand.Helpers.ServerError(w, err)
			return
		}
	}

	session, err := hand.SessionManager.NewSession(w, id)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	http.SetCookie(w, session.Cookie)
	hand.renderJSON(w, session)
}
