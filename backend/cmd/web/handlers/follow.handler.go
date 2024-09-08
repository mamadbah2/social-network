package handlers

import (
	"net/http"
	"strconv"
)

func (hand *Handler) Follows(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	actualUser := session.UserId

	switch r.Method {
	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
			return
		}

		followedID, err := strconv.Atoi(r.PostForm.Get("followedID"))
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		followerID, err := strconv.Atoi(r.PostForm.Get("followerID"))
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		action := r.PostForm.Get("action")

		switch action {
		case "follow":
			err = hand.ConnDB.SetFollower(followerID, followedID, false)
			if err != nil {
				http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
				return
			}
			hand.renderJSON(w, true)
		case "archive":
			err = hand.ConnDB.SetFollower(followerID, followedID, true)
			if err != nil {
				http.Error(w, "Cannot archive follower", http.StatusInternalServerError)
				return
			}

		default:
			http.Error(w, "invalid action parameter", http.StatusBadRequest)
			return
		}

	case http.MethodGet:
		action := r.URL.Query().Get("action")
		switch action {
		case "followers":
			followers, err := hand.ConnDB.GetFollowers(actualUser)

			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}

			hand.renderJSON(w, followers)
		case "following":
			followed, err := hand.ConnDB.GetFollowing(actualUser)

			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}

			hand.renderJSON(w, followed)
		default:
			http.Error(w, "invalid action parameter", http.StatusBadRequest)
			return
		}
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}
