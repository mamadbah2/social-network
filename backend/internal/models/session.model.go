package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"time"
)

type Session struct {
	Id         string
	UserId     int
	Data       map[string]interface{}
	Expired_at time.Time
	IsActive   bool
	Cookie     *http.Cookie
}

func (m *ConnDB) DeleteSession(sessionID string) error {
	stmt := `DELETE FROM sessions WHERE id = ?`
	_, err := m.DB.Exec(stmt, sessionID)
	return err
}

func (sess *ConnDB) GetActiveSession(userID int) (*Session, error) {
	stmt := `SELECT id FROM sessions WHERE userId = ? AND isactive = true`
	row := sess.DB.QueryRow(stmt, userID)

	s := &Session{}
	err := row.Scan(&s.Id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		} else {
			return nil, err
		}
	}

	return s, nil
}

func (u *ConnDB) GetSessions(IdUser int) (bool, error) {
	stmt := `SELECT id FROM sessions WHERE userId = ?`
	s := &Session{}
	err := u.DB.QueryRow(stmt, IdUser).Scan(&s.Id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, errors.New("models: no matching record found")
		} else {
			return false, err
		}
	}

	return true, nil
}

func (m *ConnDB) GetSession(r *http.Request) (*Session, error) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return nil, err
	}

	stmt := `
		SELECT userId, expired_at, data FROM sessions WHERE id = ?
	`
	row := m.DB.QueryRow(stmt, cookie.Value)
	s := &Session{}
	dataBytes := []byte{}
	err = row.Scan(&s.UserId, &s.Expired_at, &dataBytes)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	s.Data, err = DecodeSessionData(dataBytes)
	if err != nil {
		return nil, err
	}

	if time.Now().After(s.Expired_at) {
		m.DeleteSession(cookie.Value)
		return nil, nil
	}

	return s, nil
}

func DecodeSessionData(dataBytes []byte) (map[string]interface{}, error) {
	var decodedData map[string]interface{}
	err := json.Unmarshal(dataBytes, &decodedData)
	return decodedData, err
}

func EncodeSessionData(data map[string]interface{}) ([]byte, error) {
	return json.Marshal(data)
}

func (m *ConnDB) SetSession(s *Session) (int, error) {
	stmt := `
		INSERT INTO sessions (id, userId, data, expired_at, isactive)
		VALUES (?, ?, ?, ?,true)
	`
	encodedData, err := EncodeSessionData(s.Data)
	if err != nil {
		return 0, err
	}
	result, err := m.DB.Exec(stmt, s.Id, s.UserId, encodedData, s.Expired_at)
	if err != nil {
		return 0, err
	}
	Id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(Id), nil
}
