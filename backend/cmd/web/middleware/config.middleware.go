package middleware

import (
	"social-network/cmd/web/helpers"
	"social-network/internal/models"
)

type Middleware struct {
	Helpers *helpers.Helpers
	ConnDB *models.ConnDB
}
