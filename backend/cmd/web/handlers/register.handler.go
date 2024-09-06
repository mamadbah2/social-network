package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"time"
)

func (hand *Handler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
	defer r.Body.Close()

	//Parsing Formulaire
	err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		hand.Helpers.ClientError(w, 400)
		return
	}

	user := &models.User{}
	//Recuperation du fichier image
	file, fileHeaderImg, _ := r.FormFile("profilPicture")
	var nameImg string
	if file != nil {
		_, _ = hand.Helpers.Getfile(file, fileHeaderImg.Filename)
	}

	nameImg = fileHeaderImg.Filename
	fmt.Println("name image", nameImg)
	// Gestion de la date anniversaire, conversion time.Time
	dateStr := r.PostForm.Get("dateOfBirth")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		hand.Helpers.InfoLog.Println(r.PostForm.Get("lastname"))
		hand.Helpers.ServerError(w, err)
		return
	}
	
	user.Email = r.PostForm.Get("email")
	user.Password = r.PostForm.Get("password")
	user.FirstName = r.PostForm.Get("firstname")
	user.LastName = r.PostForm.Get("lastname")
	user.Nickname = r.PostForm.Get("nickname")
	user.DateOfBirth = date
	user.AboutMe = r.PostForm.Get("aboutMe")
	if r.PostForm.Get("privacy") == "public" {
		user.Private = false
	} else {
		user.Private = true
	}

	// Verifications de l'unicité du nickname et email
	exist, err := hand.ConnDB.CheckNickname(user.Nickname)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	if !exist {
		hand.Valid.CheckField(false, "Nickname", "Nickname already taken")
	}

	exist, err = hand.ConnDB.CheckEmail(user.Email)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	if !exist {
		hand.Valid.CheckField(false, "Email", "Email already taken")
	}

	if file != nil {
		user.ProfilePicture = nameImg
	}

	hand.Valid.CheckField(validators.NotBlank(user.FirstName), "FirstName", "This field cannot be blank")
	hand.Valid.CheckField(validators.MaxChars(user.FirstName, 20), "FirstName", "This field cannot be more than 20 characters long")
	hand.Valid.CheckField(validators.NotBlank(user.LastName), "LastName", "This field cannot be blank")
	hand.Valid.CheckField(validators.MaxChars(user.LastName, 20), "LastName", "This field cannot be more than 20 characters long")
	hand.Valid.CheckField(validators.NotBlank(user.Nickname), "Nickname", "This field cannot be blank")
	hand.Valid.CheckField(validators.MaxChars(user.Nickname, 20), "Nickname", "This field cannot be more than 20 characters long")
	hand.Valid.CheckField(validators.NotBlank(user.Email), "Email", "This field cannot be blank")
	hand.Valid.CheckField(validators.Matches(user.Email, validators.EmailRX), "email", "This field must be a valid email address")
	hand.Valid.CheckField(validators.NotBlank(user.Password), "Password", "This field cannot be blank")
	hand.Valid.CheckField(validators.MinChars(user.Password, 8), "password", "This field must be at least 8 characters long")
	hand.Valid.CheckField(validators.NotBlankInt(user.DateOfBirth.Day()), "DateOfBirth", "This field cannot be blank")
	// hand.Valid.CheckField(validators.NotBlank(user.AboutMe), "AboutMe", "This field cannot be blank")
	// hand.Valid.CheckField(validators.MaxChars(user.AboutMe, 100), "AboutMe", "This field cannot be more than 100 characters long")

	if !hand.Valid.Valid() || !exist {
		hand.renderJSON(w, nil)
		return
	}

	err = hand.ConnDB.SetUser(user)
	if err != nil {
		if errors.Is(err, errors.New("models: duplicate email")) {
			hand.Valid.AddFieldError("email", "This field already exits")
			hand.renderJSON(w, nil)
			return
		} else {
			hand.renderJSON(w, nil)
			hand.Helpers.ClientError(w, 400)
			return
		}
	}

	hand.renderJSON(w, user)

}