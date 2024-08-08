package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
)



func (hand *Handler) UserLoginPost(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	r.ParseMultipartForm(20 << 20)
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(400)
		return
	}
	formSignIn := &models.UserLoginForm{
		EmailOrUsername: r.PostForm.Get("email_Nickname"),
		Password:        r.PostForm.Get("password"),
	}
	
	hand.CheckField(validators.NotBlank(formSignIn.EmailOrUsername), "email", "This field cannot be blank")
	// formSignIn.CheckField(validator.Matches(formSignIn.EmailOrUsername, validator.EmailRX), "email", "This field must be a valid email address")
	hand.CheckField(validators.NotBlank(formSignIn.Password), "password", "This field cannot be blank")
	if !hand.Valid() {
		fmt.Println("error in signIn")
		return
	}

	id, err := hand.ConnDB.Authenticate(formSignIn.EmailOrUsername, formSignIn.Password)
	if err != nil {
		if errors.Is(err, errors.New("models: invalid credentials")) {
			hand.AddNonFieldError("credentials is incorrect")
			return
		} else {
			w.WriteHeader(500)
			return
		}
	}
	existingSession, _ :=  hand.SessionManager.GetActiveSession(id)
	if existingSession != nil {
		err := hand.SessionManager.DeleteSession(existingSession.Id)
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
		_, err2 := hand.SessionManager.NewSession(w, id)
		if err2 != nil {
			w.WriteHeader(500)
			return
		}
	} else {
		_, err2 := hand.SessionManager.NewSession(w, id)
		if err2 != nil {
			w.WriteHeader(500)
			return
		}
	}
	hand.renderJSON(w, id)
 
}