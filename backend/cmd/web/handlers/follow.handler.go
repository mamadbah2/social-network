package handlers

import (
	"fmt"
	"net/http"
	"strconv"
)

func (hand *Handler) Follows(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		id, err := strconv.Atoi(r.URL.Query().Get("id"))
		if err != nil {
			fmt.Println("error when trying to get user id :", err)
		}
		err = hand.ConnDB.SetFollower(6, id)
		if err != nil {
			http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
		}
	case http.MethodGet:
		id, err := strconv.Atoi(r.URL.Query().Get("id"))
		if err != nil {
			fmt.Println("error when trying to get user id :", err)
		}

		action := r.URL.Query().Get("action")
		if action == "followers" {
			followers, err := hand.ConnDB.GetFollowers(id)
			if err != nil {
				hand.Helpers.ServerError(w, err)
			}

			hand.renderJSON(w, followers)
		} else if action == "followed" {
			followed, err := hand.ConnDB.GetFollowed(id)
			if err != nil {
				hand.Helpers.ServerError(w, err)
			}
			hand.renderJSON(w, followed)

		} else {
			http.Error(w, "invalid action parameter", http.StatusBadRequest)
		}

	default:
		http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
	}

	// followersIDs := make([]int, len(followers))
	// followedIDs := make([]int, len(followers))
	// for i, follower := range followers {
	// 	followersIDs[i] = follower.Follower.Id
	// 	followedIDs[i] = follower.Followed.Id
	// }

}
