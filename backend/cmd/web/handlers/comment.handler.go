package handlers

import (
	"fmt"
	"net/http"
	"social-network/cmd/web/middleware"
	"social-network/cmd/web/sessionManager"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) ComsHandle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		c := &models.Comment{}

		session, ok := r.Context().Value(middleware.SessionKey).(*sessionManager.Session)
		if !ok || session == nil {
			return
		}
		c.Author.Id = session.UserId
		c.Content = r.FormValue("CommentContent")
		IDPost, err := strconv.Atoi(r.URL.Query().Get("Id"))
		if err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		c.Post.Id = IDPost
		err = hand.ConnDB.SetComment(c)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	default:
		http.Error(w, "Method NOT Allowed", 400)
		return
	}
}
