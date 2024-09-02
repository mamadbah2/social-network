package handlers

import (
	"fmt"
	"net/http"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) Events(w http.ResponseWriter, r *http.Request) {
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

	// Ce handler n'est fetchable qu'en methode Get vu le register
	switch r.Method {
	case http.MethodGet:
		/* if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		} */

		query := r.URL.Query()
		if len(query) == 0 {
			events, err := hand.ConnDB.GetAllEvents()
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(w, events)
		} else {
			eventID, err := strconv.Atoi(query.Get("id"))
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
			}
			event, err := hand.ConnDB.GetEvent(eventID)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(w, event)
		}

	case http.MethodPost:
		fmt.Println("adding Event")
		err := r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		gID := r.PostForm.Get("group_id")
		groupID, err := strconv.Atoi(gID)
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		title := r.PostForm.Get("title")
		hand.Valid.CheckField(validators.NotBlank(title), "title", "This field cannot be blank")

		description := r.PostForm.Get("description")
		hand.Valid.CheckField(validators.NotBlank(description), "description", "This field cannot be blank")

		date := r.PostForm.Get("date")
		hand.Valid.CheckField(validators.NotBlank(date), "date", "This field cannot be blank")

		time := r.PostForm.Get("time")
		hand.Valid.CheckField(validators.NotBlank(time), "time", "This field cannot be blank")

		event := &models.Event{
			Title:       title,
			Description: description,
			Date:        date,
			Time:        time,
			Creator:     actualUser,
			Group:       &models.Group{Id: groupID},
		}

		_, err = hand.ConnDB.SetEvent(event)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}
	}
}
