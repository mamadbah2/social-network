package models

import (
	"database/sql"
	"errors"
	"social-network/cmd/web/validators"

	"golang.org/x/crypto/bcrypt"
)

func (m *ConnDB) Authenticate(emailOrUsername, password string) (int, error) {
	var id int
	var passwordeu string
	var stmt string
	if validators.Matches(emailOrUsername, validators.EmailRX) {
		stmt = `SELECT id, password FROM users WHERE email = ?`
	} else {
		stmt = `SELECT id, password FROM users WHERE nickname = ?`
	}
	err := m.DB.QueryRow(stmt, emailOrUsername).Scan(&id, &passwordeu)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, errors.New("models: invalid credentials")
		} else {
			return 0, err
		}
	}
	err = bcrypt.CompareHashAndPassword([]byte(passwordeu), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, errors.New("models: invalid credentials")
		} else {
			return 0, err
		}
	}
	return id, nil

}

func (m *ConnDB) CheckNickname(nickname string) (bool, error) {
	var record int
	// Prepare a query to check if the username exists
	stmt := `SELECT count(*) FROM users WHERE nickname = ?`
	err := m.DB.QueryRow(stmt, nickname).Scan(&record)
	if err != nil {
		return false, err
	}
	return record == 0, nil
}

func (m *ConnDB) CheckEmail(email string) (bool, error) {
	var record int
	// Prepare a query to check if the username exists
	stmt := `SELECT count(*) FROM users WHERE email = ?`
	err := m.DB.QueryRow(stmt, email).Scan(&record)
	if err != nil {
		return false, err
	}
	return record == 0, nil
}
