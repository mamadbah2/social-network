package handlers

import (
	"net/http"
	"os"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) ComsHandle(w http.ResponseWriter, r *http.Request) {
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
	switch r.Method {
	case http.MethodPost:
		err = r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
			return
		}
		var tempFile *os.File
		fileImg, fileHeaderImg, _ := r.FormFile("commentImage")
		var nameImg string
		if fileImg != nil {
			tempFile, _ = hand.Helpers.Getfile(fileImg, fileHeaderImg.Filename)
			nameImg = fileHeaderImg.Filename
			hand.Valid.CheckField(validators.VerifyImg(tempFile.Name()), "commentImage", "choose a valid image")
			hand.Valid.CheckField(validators.CheckFileSize(tempFile.Name()), "commentImage", "max size image should be 20 mb")
		} else {
			nameImg = ""
		}
		if !hand.Valid.Valid() {
			hand.renderJSON(w, nil)
			return
		}
	

		c := &models.Comment{
			Post:   &models.Post{}, // Initialize Post
			Author: &models.User{}, // Initialize Author
		}
		c.Author, err = hand.ConnDB.GetUser(session.UserId)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		c.Content = r.PostForm.Get("CommentContent")
		c.ImageName = nameImg
		IDPost, err := strconv.Atoi(r.URL.Query().Get("Id"))
		if err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		c.Post.Id = IDPost
		c.Id, err = hand.ConnDB.SetComment(c)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}
		hand.renderJSON(w, c)
	default:
		http.Error(w, "Method NOT Allowed", 400)
		return
	}
}
