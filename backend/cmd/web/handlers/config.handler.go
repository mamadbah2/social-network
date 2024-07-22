package handlers

import (
	"encoding/json"
	"net/http"

	"social-network/cmd/web/helpers"
	"social-network/internal/models"
)

type Handler struct {
	Helpers *helpers.Helpers
	ConnDB *models.ConnDB
}

func (hand *Handler) renderJSON(w http.ResponseWriter, data interface{}) {
	// Transformation de toutes les données en json
	dataByte, err := json.Marshal(data)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	// Ecriture dans le w (ResponseWritter)
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(dataByte)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}
}