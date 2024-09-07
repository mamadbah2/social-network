package handlers

import (
	"net/http"
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

		fileImg, fileHeaderImg, _ := r.FormFile("commentImage")
		var nameImg string
		if fileImg != nil {
			_, _ = hand.Helpers.Getfile(fileImg, fileHeaderImg.Filename)
			nameImg = fileHeaderImg.Filename
		} else {
			nameImg = ""
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
