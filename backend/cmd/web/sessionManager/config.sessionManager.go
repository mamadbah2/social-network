package sessionManager

import (
	"database/sql"
	"sync"
)

type SessionManager struct {
	Sessions map[string]*Session
	Db       *sql.DB
	mu       sync.RWMutex
}