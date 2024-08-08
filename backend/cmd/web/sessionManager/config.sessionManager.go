package sessionManager

import (
	"social-network/internal/models"
	"sync"
)

type SessionManager struct {
	mu     sync.RWMutex
	ConnDB *models.ConnDB
}
