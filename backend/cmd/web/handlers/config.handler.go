package handlers

import (
	"encoding/json"
	"net/http"

	"social-network/cmd/web/helpers"
	"social-network/cmd/web/sessionManager"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
)

type Handler struct {
	Helpers *helpers.Helpers
	ConnDB  *models.ConnDB
	SessionManager *sessionManager.SessionManager
	*validators.Validator
}

type FrontData struct {
	datas interface{}
	errors map[string]string
}

func (hand *Handler) renderJSON(w http.ResponseWriter, data interface{}) {
	frontData := &FrontData{
		datas: data,
		errors: hand.FieldErrors,
	}

	// Transformation de toutes les données en json
	dataByte, err := json.MarshalIndent(frontData, "", "	")
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