package models

import (
	"database/sql"
	"sync"
)

type ConnDB struct {
	DB *sql.DB
	mu sync.RWMutex
}
