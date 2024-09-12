package models

type Message struct {
	ID       int
	Content  string
	Type     string
	Sender   *User
	Receiver *User
	SentAt   string
}

func (m *ConnDB) GetOldConversation(SenderID, ReceiverID int, MsgType string) ([]*Message, error) {
	stmt := `
		SELECT * FROM messages
		WHERE id_sender = ? AND id_receiver = ? AND message_type = ?
		OR id_receiver = ? AND id_sender = ? AND message_type = ?
	`

	rows, err := m.DB.Query(stmt, SenderID, ReceiverID, MsgType, SenderID, ReceiverID, MsgType)
	if err != nil {
		return nil, err
	}

	if MsgType == "group" {
		rows, err = m.DB.Query("SELECT * FROM messages WHERE id_receiver = ? AND message_type = ?", ReceiverID, MsgType)
		if err != nil {
			return nil, err
		}
	}

	defer rows.Close()

	var messages []*Message
	var rID, sID int
	for rows.Next() {
		msg := &Message{}
		err := rows.Scan(&msg.ID, &sID, &rID, &msg.Content, &msg.Type, &msg.SentAt)
		if err != nil {
			return nil, err
		}
		msg.Sender, err = m.GetUser(sID)
		if err != nil {
			return nil, err
		}
		msg.Receiver, err = m.GetUser(rID)
		if err != nil {
			return nil, err
		}

		messages = append(messages, msg)
	}
	return messages, nil
}

func (m *ConnDB) SaveMessage(msg *Message) (int, error) {
	stmt := `
		INSERT INTO messages (id_sender, id_receiver, content, message_type, created_at)
		VALUES (?, ?, ?, ?, ?)
	`
	result, err := m.DB.Exec(stmt, msg.Sender.Id, msg.Receiver.Id, msg.Content, msg.Type, msg.SentAt)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}
