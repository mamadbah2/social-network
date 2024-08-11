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

type AllData struct {
	BadRequestForm bool
}

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
	switch r.Method {
	case http.MethodGet:
		data, err := hand.ConnDB.GetAllPost()
		fmt.Println(data)
		if err != nil {
			hand.Helpers.ServerError(w, err)
		}

		hand.renderJSON(w, data)

	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		fileImg, fileHeaderImg, err := r.FormFile("imagePost")
		var nameImg string
		if err == nil {
			if int(fileHeaderImg.Size) > 20000000 || !hand.Valid.ImageValidation(fileImg) {
				hand.renderJSON(w, &AllData{BadRequestForm: true})
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
			hand.renderJSON(w, &AllData{BadRequestForm: true})
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

		lastPostId, err := hand.ConnDB.SetPost(title, escapedContent, nameImg, privacy, actualUser.Id, groupId)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		if privacy == "almost private" {
			followers := r.Form["followers"]
			for _, followerId := range followers {
				fId, err := strconv.Atoi(strings.TrimSpace(followerId))
				if err != nil {
					hand.Helpers.ClientError(w, http.StatusBadRequest)
					return
				}
				_, err = hand.ConnDB.SetPostViewer(lastPostId, fId)
				if err != nil {
					hand.Helpers.ServerError(w, err)
					return
				}
			}
		}

		hand.renderJSON(w, &AllData{BadRequestForm: false})

	default:
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
}
