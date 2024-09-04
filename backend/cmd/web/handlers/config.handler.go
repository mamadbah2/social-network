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
	Helpers        *helpers.Helpers
	ConnDB         *models.ConnDB
	SessionManager *sessionManager.SessionManager
	Valid          *validators.Validator
}

type FrontData struct {
	Datas  interface{}
	Errors map[string]string
}

func (hand *Handler) renderJSON(w http.ResponseWriter, data interface{}) {
	frontData := &FrontData{
		Datas:  data,
		Errors: hand.Valid.FieldErrors,
	}
	// fmt.Println("frontData", frontData)
	// Transformation de toutes les données en json
	dataByte, err := json.Marshal(frontData)
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

	// On remove les erreurs du field error
	hand.Valid.FieldErrors = make(map[string]string)
}
