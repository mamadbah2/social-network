package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"time"
)


func (hand *Handler) UserRegister(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	errMultiparseform := r.ParseMultipartForm(20 << 20)
	if errMultiparseform != nil {

		w.WriteHeader(400)
		return
	}
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}
	user := &models.User{}
	file, _, _ := r.FormFile("profilPicture")
	var tempFile *os.File
	if file != nil {
		tempFile, _ = hand.Helpers.Getfile(file)
	}
	dateStr := r.PostForm.Get("dateOfBirth")
	layout := "01-02-2006"
	date, err := time.Parse(layout, dateStr)
	if err != nil {
		fmt.Println("Erreur lors de la conversion de la date:", err)
		return
	}
	
	user.Email = r.PostForm.Get("email")
	user.Password = r.PostForm.Get("password")
	user.FirstName = r.PostForm.Get("firstname")
	user.LastName =  r.PostForm.Get("lastname")
	user.Nickname = r.PostForm.Get("nickname")
	user.DateOfBirth = date
	user.AboutMe = r.PostForm.Get("about_me")
	if (r.PostForm.Get("private") == "public"){
		user.Private = false
	}else if (r.PostForm.Get("private") == "private"){
		user.Private = true
	}
	
	exist, err := hand.CheckUsernameExists(user.Nickname)
	if err != nil {
		fmt.Println("error occur")
	}
	if exist {
		hand.CheckField(false, "Nickname", "Nickname already taken")
	}

	if tempFile != nil {
		user.ProfilePicture = tempFile.Name()
		hand.CheckField(validators.VerifyImg(user.ProfilePicture), "profilPicture", "choose a valid image")
		hand.CheckField(validators.CheckFileSize(user.ProfilePicture), "profilPicture", "max size image should be 20 mb")
	} else {
		fmt.Println("here")
		user.ProfilePicture = ""
	}

	hand.CheckField(validators.NotBlank(user.FirstName), "FirstName", "This field cannot be blank")
	hand.CheckField(validators.MaxChars(user.FirstName, 20), "FirstName", "This field cannot be more than 20 characters long")
	hand.CheckField(validators.NotBlank(user.LastName), "LastName", "This field cannot be blank")
	hand.CheckField(validators.MaxChars(user.LastName, 20), "LastName", "This field cannot be more than 20 characters long")
	hand.CheckField(validators.NotBlank(user.Nickname), "Nickname", "This field cannot be blank")
	hand.CheckField(validators.MaxChars(user.Nickname, 20), "Nickname", "This field cannot be more than 20 characters long")
	hand.CheckField(validators.NotBlank(user.Email), "Email", "This field cannot be blank")
	hand.CheckField(validators.Matches(user.Email, validators.EmailRX), "email", "This field must be a valid email address")
	hand.CheckField(validators.NotBlank(user.Password), "Password", "This field cannot be blank")
	hand.CheckField(validators.MinChars(user.Password, 8), "password", "This field must be at least 8 characters long")
	hand.CheckField(validators.NotBlankInt(user.DateOfBirth.Day()), "DateOfBirth", "This field cannot be blank")
	hand.CheckField(validators.NotBlank(user.AboutMe), "AboutMe", "This field cannot be blank")
	hand.CheckField(validators.MaxChars(user.AboutMe, 100), "AboutMe", "This field cannot be more than 100 characters long")

	if !hand.Valid() || exist {
		
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err2 := hand.ConnDB.InsertUser(*user)
	if err2 != nil {
		if errors.Is(err2, errors.New("models: duplicate email")) {
			fmt.Println("error")
		} else {
			w.WriteHeader(400)
			return
		}

		return
	}
	fmt.Println("hello")
	hand.renderJSON(w, user)

}