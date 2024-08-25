package handlers

import (
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
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

	data, err := hand.ConnDB.GetAllPost()
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
		fmt.Println("yoooo")
		err := r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		fileImg, fileHeaderImg, err := r.FormFile("imagePost")
		var nameImg string
		if err == nil {
			if int(fileHeaderImg.Size) > 20000000 || !hand.Valid.ImageValidation(fileImg) {
				hand.renderJSON(w, &data)
				if int(fileHeaderImg.Size) > 20000000 || !hand.Valid.ImageValidation(fileImg) {
					hand.Helpers.ClientError(w, http.StatusBadRequest)
					return
				}
				if _, err := fileImg.Seek(0, io.SeekStart); err != nil {
					fmt.Println("Error resetting file reader position:", err)
					return
				}
				nameImg = time.Now().Format("20060102_150405") + fileHeaderImg.Filename
				dst, err := os.Create("./ui/static/uploads/" + nameImg)
				if err != nil {
					hand.Helpers.ServerError(w, err)
					return
				}
				defer dst.Close()
				_, err = io.Copy(dst, fileImg)
				if err != nil {
					hand.Helpers.ServerError(w, err)
					return
				}

			} else {
				hand.Helpers.InfoLog.Println(err, " --Pas d'image set")
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

			_, err = hand.ConnDB.SetPost(title, escapedContent, nameImg, privacy, actualUser.Id, groupId, selectedFollowers)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
		}
		hand.renderJSON(w, nil)

	default:
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
}
