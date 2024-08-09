package models

import (
	"database/sql"
	"errors"
)

type ConnDB struct {
	DB *sql.DB
}

var (
	ErrNoRecord = errors.New("models: no matching record found")

	ErrInvalidCredentials = errors.New("models: invalid credentials")

	ErrDuplicateEmail = errors.New("models: duplicate email")

	ErrValueTooLong = errors.New("cookie value too long")

	ErrInvalidValue = errors.New("invalid cookie value")
)
