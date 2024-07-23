package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/cmd/web/validators"
)

type userLoginForm struct{
	EmailOrUsername string
	Password string
}

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
	formSignIn := userLoginForm{
		EmailOrUsername: r.PostForm.Get("email_Nickname"),
		Password:        r.PostForm.Get("password"),
	}
	// if (validator.Matches(formSignIn.EmailOrUsername, validator.EmailRX)) {

	// }
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
	// existingSession, _ := app.newsession.GetActiveSession(id)
	// if existingSession != nil {
	// 	err := app.newsession.DeleteSession(existingSession.SessionID)
	// 	if err != nil {
	// 		data := app.newTemplateData(r)
	// 		w.WriteHeader(500)
	// 		data.Error = repository.Err[500]
	// 		json.NewEncoder(w).Encode(data) // Assurez-vous d'encoder la réponse en JSON
	// 		return
	// 	}
	// 	cookie := http.Cookie{
	// 		Name:     "session",
	// 		Value:    existingSession.SessionID,
	// 		MaxAge:   -1,
	// 		Path:     "/",
	// 		HttpOnly: true,
	// 		Secure:   true,
	// 	}
	// 	http.SetCookie(w, &cookie)
	// 	_, err2 := app.newsession.NewSession(w, id)
	// 	if err2 != nil {
	// 		data := app.newTemplateData(r)
	// 		w.WriteHeader(500)
	// 		data.Error = repository.Err[500]
			
	// 		json.NewEncoder(w).Encode(data) // Assurez-vous d'encoder la réponse en JSON
	// 		return
	// 	}
	// } else {
	// 	_, err2 := app.newsession.NewSession(w, id)
	// 	if err2 != nil {
	// 		data := app.newTemplateData(r)
	// 		w.WriteHeader(500)
	// 		data.Error = repository.Err[500]
	// 		json.NewEncoder(w).Encode(data) // Assurez-vous d'encoder la réponse en JSON
	// 		return
	// 	}
	// }
	hand.renderJSON(w, id)

 
}