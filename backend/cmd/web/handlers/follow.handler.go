package handlers

import (
	"net/http"
	"strconv"
)

func (hand *Handler) Follows(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		action := r.URL.Query().Get("action")
		switch action {
		case "follow":
			err = hand.ConnDB.SetFollower(6, id)
			if err != nil {
				http.Error(w, "Cannot Set Follower", http.StatusBadRequest)
				return
			}

		case "archive":
			err = hand.ConnDB.ArchiveFollower(6, id)
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
			followers, err := hand.ConnDB.GetFollowers(id)

			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}

			hand.renderJSON(w, followers)
		case "following":
			followed, err := hand.ConnDB.GetFollowing(id)

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

	// followersIDs := make([]int, len(followers))
	// followedIDs := make([]int, len(followers))
	// for i, follower := range followers {
	// 	followersIDs[i] = follower.Follower.Id
	// 	followedIDs[i] = follower.Followed.Id
	// }

}
