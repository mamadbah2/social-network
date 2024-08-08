package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

type Session struct {
	Id         string
	UserId     int
	Data       map[string]interface{}
	Expired_at time.Time
	IsActive   bool
	Cookie     http.Cookie
}

func (m *ConnDB) DeleteSession(sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	stmt := `DELETE FROM session WHERE id = ?`
	_, err := m.DB.Exec(stmt, sessionID)
	return err
}

func (sess *ConnDB) GetActiveSession(userID int) (*Session, error) {
	sess.mu.Lock()         // Lock the map for writing
	defer sess.mu.Unlock() // Defer the unlocking of the map
	stmt := `SELECT id FROM session WHERE userId = ? AND isactive = true`
	row := sess.DB.QueryRow(stmt, userID)

	s := &Session{}
	err := row.Scan(&s.Id)
	if err != nil {

		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("models: no matching record found")
		} else {
			return nil, err
		}
	}

	return s, nil
}

func (u *ConnDB) GetSessions(IdUser int) (bool, error) {
	stmt := `SELECT id FROM session WHERE userId = ?`
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

func (sess *ConnDB) GetSession(r *http.Request) (*Session, error) {
	sess.mu.Lock()         // Lock the map for writing
	fmt.Println("*********** *********")
	defer sess.mu.Unlock() // Defer the unlocking of the map
	cookie, err := r.Cookie("session")
	if err != nil {
		if err == http.ErrNoCookie {
			return nil, nil
		}
		return nil, err
	}

	sessionID := cookie.Value
	// session, ok := sess.Sessions[sessionID]
	// if !ok {
	row := sess.DB.QueryRow("SELECT userId, data, expired_at FROM session WHERE id = ?", sessionID)
	dataBytes := []byte{}
	expires := time.Time{}
	var iduser int
	err = row.Scan(&iduser, &dataBytes, &expires)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	decodedData, err := DecodeSessionData(dataBytes)
	if err != nil {
		return nil, err
	}

	if time.Now().After(expires) {
		sess.DeleteSession(sessionID)
		return nil, nil
	}

	session := &Session{
		Id:         sessionID,
		UserId:     iduser,
		Data:       decodedData,
		Expired_at: expires,
		Cookie:     *cookie,
	}
	// }

	return session, nil
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
	statement := `INSERT INTO session (id, userId, data, expired_at, isactive)
					 VALUES (?, ?, ?, ?,true)
					`
	encodedData, err := EncodeSessionData(s.Data)
	if err != nil {
		return 0, err
	}
	result, err := m.DB.Exec(statement, s.Id, s.UserId, encodedData, s.Expired_at)
	if err != nil {
		return 0, err
	}
	Id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(Id), nil
}
