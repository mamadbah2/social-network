package handlers

import (
	"errors"
	"log"
	"net/http"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) LikeReaction(w http.ResponseWriter, r *http.Request) {
	id_entity, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		reaction_type := r.URL.Query().Get("reaction_type")
		check, err := hand.ConnDB.CheckLikeReaction(id_entity, 2, reaction_type)
		if errors.Is(err, models.ErrNoRecord) {
			err := hand.ConnDB.InsertReaction(id_entity, 2, reaction_type, true, false)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}
		} else if check.Liked {
			err := hand.ConnDB.UpdateReaction(id_entity, 2, reaction_type, false, false)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}
		} else if !check.Liked {
			err := hand.ConnDB.UpdateReaction(id_entity, 2, reaction_type, true, false)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

func (hand *Handler) DislikeReaction(w http.ResponseWriter, r *http.Request) {
	id_entity, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		reaction_type := r.URL.Query().Get("reaction_type")
		check, err := hand.ConnDB.CheckDislikeReaction(id_entity, 2, reaction_type)
		if errors.Is(err, models.ErrNoRecord) {
			err := hand.ConnDB.InsertReaction(id_entity, 2, reaction_type, false, true)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}
		} else if check.Disliked {
			err := hand.ConnDB.UpdateReaction(id_entity, 2, reaction_type, false, false)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}

		} else if !check.Disliked {
			err := hand.ConnDB.UpdateReaction(id_entity, 2, reaction_type, false, true)
			if err != nil {
				log.Println("error:", err)
				w.WriteHeader(500)
				return
			}
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
