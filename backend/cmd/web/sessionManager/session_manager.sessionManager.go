package sessionManager

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/internal/models"
	"time"

	"github.com/gofrs/uuid/v5"
)

func GenerateSessionID() string {
	u2, err := uuid.NewV4()
	if err != nil {
		log.Fatalf("failed to generate UUID: %v", err)
	}

	return u2.String()
}

func (sess *SessionManager) NewSession(w http.ResponseWriter, iduser int) (*models.Session, error) {
	sessionId := GenerateSessionID()

	session := &models.Session{
		Id:         sessionId,
		UserId:     iduser,
		IsActive:   true,
		Data:       make(map[string]interface{}),
		Expired_at: time.Now().Add(120 * time.Minute),
		Cookie: &http.Cookie{
			Name:     "session",
			Value:    sessionId,
			Expires:  time.Now().Add(120 * time.Minute),
			MaxAge:   3600,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		},
	}

	_, err := sess.ConnDB.SetSession(session)
	if err != nil {
		return nil, err
	}

	http.SetCookie(w, session.Cookie)

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

/* func DeleteAllTableContent(db *sql.DB, tableName string) error {
	query := "DELETE FROM " + tableName

	_, err := db.Exec(query)
	if err != nil {
		log.Printf("Error deleting all content from table %s: %v", tableName, err)
		return err
	}

	return nil
}
 */