package middleware

import (
	"social-network/cmd/web/helpers"
	"social-network/cmd/web/sessionManager"
)

type Middleware struct {
	Helpers *helpers.Helpers
	SessionManager *sessionManager.SessionManager
}
