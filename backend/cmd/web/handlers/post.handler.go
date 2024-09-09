package handlers

import (
	"html"
	"net/http"
	"social-network/internal/models"
	"strconv"
	"strings"
)

func (hand *Handler) Post(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	actualUser, err := hand.ConnDB.GetUser(session.UserId)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	data, err := hand.ConnDB.GetAllPostByVisibility(actualUser.Id)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	switch r.Method {
	case http.MethodGet:
		query := r.URL.Query()
		if len(query) == 0 {
			hand.renderJSON(w, data)
		} else {
			// Retrieve post by ID
			postIDStr := query.Get("id")
			if postIDStr == "" {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}

			postID, err := strconv.Atoi(postIDStr)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}

			post, err := hand.ConnDB.GetPost(postID)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}

			hand.renderJSON(w, post)
		}
	case http.MethodPost:
		//Parsing Formulaire
		err := r.ParseMultipartForm(20 << 20)
		if err != nil {
			hand.Helpers.ClientError(w, 400)
			return
		}

		fileImg, fileHeaderImg, _ := r.FormFile("imagePost")
		var nameImg string
		if fileImg != nil {
			_, _ = hand.Helpers.Getfile(fileImg, fileHeaderImg.Filename)
			nameImg = fileHeaderImg.Filename
		} else {
			nameImg = ""
		}

		title := r.PostForm.Get("title")
		content := r.PostForm.Get("content")
		privacy := r.PostForm.Get("privacy")
		groupIdStr := r.PostForm.Get("group_id")
		escapedContent := html.EscapeString(content)

		if strings.TrimSpace(escapedContent) == "" || strings.TrimSpace(title) == "" || strings.TrimSpace(privacy) == "" {
			http.Error(w, "Title, content, and privacy fields must not be empty.", http.StatusBadRequest)
			return
		}

		var groupId int
		if groupIdStr != "" {
			groupId, err = strconv.Atoi(groupIdStr)
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}
		}

		selectedFollowers := []int{}
		if privacy == "almost private" {
			followers := r.Form["followers"]
			for _, followerId := range followers {
				fId, err := strconv.Atoi(strings.TrimSpace(followerId))
				if err != nil {
					hand.Helpers.ClientError(w, http.StatusBadRequest)
					return
				}
				selectedFollowers = append(selectedFollowers, fId)
			}
		}

		idPost, err := hand.ConnDB.SetPost(title, escapedContent, nameImg, privacy, actualUser.Id, groupId, selectedFollowers)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}
		lastPost := models.Post{
			Id:        idPost,
			Title:     title,
			Content:   escapedContent,
			ImageName: nameImg,
			Privacy:   privacy,
			Author:    actualUser,
			Group: &models.Group{
				Id: groupId,
			},
		}
		hand.renderJSON(w, lastPost)

	default:
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
}
