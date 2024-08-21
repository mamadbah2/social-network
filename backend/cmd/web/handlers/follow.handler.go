package handlers

import (
	"fmt"
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
			fmt.Println("yooo")
			hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
			return
		}

		followedID, err := strconv.Atoi(r.PostForm.Get("id"))
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		action := r.PostForm.Get("action")
		fmt.Println(r.PostForm.Get("action"))
		followed, err := hand.ConnDB.GetUser(followedID)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}

		switch action {
		case "follow":
			if followed.Private {
				err = hand.ConnDB.SetFollower(actualUser, followedID, "pending")
				if err != nil {
					http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
					return
				}
			} else {
				err = hand.ConnDB.SetFollower(actualUser, followedID, "follow")
				if err != nil {
					http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
					return
				}
			}
		case "acceptRequest":
			err = hand.ConnDB.SetFollower(followedID, actualUser, "follow")
			if err != nil {
				http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
				return
			}
		case "refuseRequest":
			err = hand.ConnDB.SetFollower(followedID, actualUser, "unfollow")
			if err != nil {
				http.Error(w, "Cannot archive follower", http.StatusInternalServerError)
				return
			}

		case "archive":
			err = hand.ConnDB.SetFollower(actualUser, followedID, "unfollow")
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
