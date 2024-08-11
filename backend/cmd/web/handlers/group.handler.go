package handlers

import (
	"net/http"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) Groups(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodGet {
		GroupIdStr := r.URL.Query().Get("id")
		GroupId, err := strconv.Atoi(GroupIdStr)
		if (err != nil) || GroupId < 1 {

			http.NotFound(w, r)
			return
		}

		//will render the group data
		g, err := hand.ConnDB.GetGroup(GroupId)
		if err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		hand.renderJSON(w, g)
		return
	}
	if r.Method == http.MethodPost {
		g := &models.Group{}
		//need Sessions here to take the userID
		g.Name = r.FormValue("GroupName")
		g.Description = r.FormValue("GroupDescrp")
		err := hand.ConnDB.SetGroup(g)
		if err != nil {
			
			w.WriteHeader(500)
			return
		}
	}

}