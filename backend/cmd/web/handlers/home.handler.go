package handlers

import (
	"net/http"
)

func (hand *Handler) Home(w http.ResponseWriter, r *http.Request) {
	// Logique traitement ici
	hand.renderJSON(w, "Welcome to social-network")
}