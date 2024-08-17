package models

type Message struct {
	Id         int
	Content    string `json:"content"`
	Type       string `json:"type"`
	SenderID   int    `json:"senderID"`
	ReceiverID int    `json:"receiverID"`
	Date       string `json:"date"`
}

func (m *ConnDB) GetOldConversation(SenderID, ReceiverID int) ([]*Message, error) {
	stmt := `
		SELECT * FROM messages
		WHERE id_sender = ? AND id_receiver = ?
		OR id_receiver = ? AND id_sender = ?
	`

	rows, err := m.DB.Query(stmt, SenderID, ReceiverID, ReceiverID, SenderID)
	if err != nil {
		return nil, err
	}

	var messages []*Message
	for rows.Next() {
		m := &Message{}
		err := rows.Scan(&m.Id, &m.SenderID, &m.ReceiverID, &m.Content, &m.Type, &m.Date)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}