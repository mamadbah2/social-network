	package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) GroupsHandle(w http.ResponseWriter, r *http.Request) {
	session, ok := hand.ConnDB.GetSession(r)
	if ok != nil {
		hand.Helpers.ServerError(w, ok)
		return
	}
	if r.Method == http.MethodGet {
		GroupIdStr := r.URL.Query().Get("id")
		
		if GroupIdStr == "" {
			Allg, err := hand.ConnDB.GetAllGroups()
			if err != nil {
				hand.Helpers.ClientError(w, http.StatusBadRequest)
				return
			}
			hand.renderJSON(w, Allg)
			return
		}
		
		GroupId, err := strconv.Atoi(GroupIdStr)
		if (err != nil) || GroupId < 1 {
			hand.Helpers.ClientError(w, http.StatusNotFound)
			return
		}
		
		//will render the group data
		g, err := hand.ConnDB.GetGroup(GroupId)
		if err != nil {
			http.Error(w, err.Error(), 404)
			return
		}
		fmt.Println(g)
		hand.renderJSON(w, g)
		return
	}
	if r.Method == http.MethodPost {
		fmt.Println("ok not okay")
		groupIdStr := r.FormValue("GroupId")
		if groupIdStr != "" {
			//for asking to join a group
			groupId, idErr := strconv.Atoi(groupIdStr)
			if idErr != nil {
				hand.Helpers.ServerError(w, idErr)
				return
			}
			err := hand.ConnDB.SetGroupMember(session.UserId, groupId)
			if err != nil {
				http.Error(w, "Error Creating Member", 400)
				return
			}
			return
		}
		g := &models.Group{
			Creator: &models.User{},
		}
		//need Sessions here to take the userID
		g.Name = r.FormValue("GroupName")
		g.Description = r.FormValue("GroupDescrp")
		g.Creator.Id = session.UserId
		err := hand.ConnDB.SetGroup(g)
		if err != nil {
			hand.Helpers.ServerError(w, err)
			return
		}
		return
	}
	http.Error(w, "not allowed", http.StatusMethodNotAllowed)
}

func (hand *Handler) GroupMembersHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		GroupIdStr := r.URL.Query().Get("id")
		if GroupIdStr == "" {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}
		
		GroupId, err := strconv.Atoi(GroupIdStr)
		if (err != nil) || GroupId < 1 {
			hand.Helpers.ClientError(w, http.StatusNotFound)
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
		hand.renderJSON(w, "Members Added")
	} else {
		http.Error(w, "not Allowed", 400)
	}
}

func  (hand *Handler) GroupHomePageHandle(w http.ResponseWriter, r *http.Request) {
	session, ok := hand.ConnDB.GetSession(r)
	if ok != nil {
		hand.Helpers.ServerError(w, ok)
		return
	}
	groups, err := hand.ConnDB.GetGroupsByUser(session.UserId)
	if err != nil {
		http.Error(w, "Not Found", 404)
		return
	}
	allPosts := hand.ConnDB.GetAllGroupsPosts(groups)

	hand.renderJSON(w, allPosts)
}