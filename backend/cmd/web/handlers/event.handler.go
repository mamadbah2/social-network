package handlers

import (
	"net/http"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) Events(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	user, err := hand.ConnDB.GetUser(1)
	// Ce handler n'est fetchable qu'en methode Get vu le register
	switch r.Method {
	case http.MethodGet:
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		query := r.URL.Query()
		if len(query) == 0 {
			events, err := hand.ConnDB.GetAllEvents(user.Id)
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
		err := r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
		}

		gID := r.PostForm.Get("group_id")
		groupID, err := strconv.Atoi(gID)
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
		}

		title := r.PostForm.Get("title")
		hand.CheckField(validators.NotBlank(title), "title", "This field cannot be blank")

		description := r.PostForm.Get("description")
		hand.CheckField(validators.NotBlank(description), "description", "This field cannot be blank")

		event := &models.Event{
			Title:       title,
			Description: description,
			Creator:     user,
			Group:       &models.Group{Id: groupID},
		}

		hand.ConnDB.SetEvent(event)

	}
}
