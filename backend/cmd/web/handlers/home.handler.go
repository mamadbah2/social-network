package handlers

import (
	"net/http"
	"social-network/internal/models"
)

func (hand *Handler) Home(w http.ResponseWriter, r *http.Request) {
	// Logique traitement ici
	hand.renderJSON(w, models.User{Nickname: "Social-Network"})
}