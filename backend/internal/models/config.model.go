package models

import (
	"database/sql"
)

type ConnDB struct {
	DB *sql.DB
}
