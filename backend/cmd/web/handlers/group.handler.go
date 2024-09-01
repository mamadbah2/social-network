	package handlers

import (
	"net/http"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) GroupsHandle(w http.ResponseWriter, r *http.Request) {
	session, ok := hand.ConnDB.GetSession(r)
	if ok != nil {
		http.Error(w, "session error", 500)
		return
	}
	if r.Method == http.MethodGet {
		GroupIdStr := r.URL.Query().Get("id")

		if GroupIdStr == "" {
			Allg, err := hand.ConnDB.GetAllGroups()
			if err != nil {
				http.Error(w, err.Error(), 400)
				return
			}
			hand.renderJSON(w, Allg)
			return
		}

		GroupId, err := strconv.Atoi(GroupIdStr)
		if (err != nil) || GroupId < 1 {
			http.NotFound(w, r)
			return
		}

		//will render the group data
		g, err := hand.ConnDB.GetGroup(GroupId)
		if err != nil {
			http.Error(w, err.Error(), 404)
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
		g.Creator.Id = session.UserId
		err := hand.ConnDB.SetGroup(g)
		if err != nil {
			w.WriteHeader(500)
			return
		}
	}
	http.Error(w, "not allowed", http.StatusMethodNotAllowed)
}

func (hand *Handler) GroupMembersHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		GroupIdStr := r.URL.Query().Get("id")
		if GroupIdStr == "" {
			http.Error(w, "Bad Request", 400)
			return
		}

		GroupId, err := strconv.Atoi(GroupIdStr)
		if (err != nil) || GroupId < 1 {
			http.NotFound(w, r)
			return
		}

		if err := r.ParseForm(); err != nil {
			http.Error(w, "form parse error", 400)
			return
		}

		AllMembers := r.Form["MembersSelected"]
		for _, Member := range AllMembers {
			MemId, err := strconv.Atoi(Member)
			if err != nil {
				http.Error(w, "Not Found", 404)
				return
			}
			err = hand.ConnDB.SetGroupMember(MemId, GroupId)
			if err != nil {
				http.Error(w, "Error Creating Member", 400)
				return
			}
		}
	} else {
		http.Error(w, "not Allowed", 400)
	}
}
