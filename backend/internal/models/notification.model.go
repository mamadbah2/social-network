package models

import "time"

type Notification struct {
	Id         int
	Content    string
	Approuved  bool
	CreatedAt  time.Time
	EntityType string // exple message, event, follow, rejoin group
	EntityID   int    // là ce sera id de l'entité considéré
	Sender   *User
	Receiver *User
}

func (m *ConnDB) GetNotifications(receiverID int) ([]*Notification, error) {
	stmt := `
		SELECT n.id, n.content, n.approuved, n.created_at,
			n.entity_type, n.entity_id, n.sender_id, n.receiver_id
		FROM notifications n
		WHERE receiver_id = ? AND approuved = false
	`

	rows, err := m.DB.Query(stmt, receiverID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifs []*Notification
	for rows.Next() {
		n := &Notification{
			Sender: &User{},
			Receiver: &User{},
		}
		var s, r int
		err = rows.Scan(&n.Id, &n.Content, &n.Approuved, &n.CreatedAt, &n.EntityType, &n.EntityID, &s, &r)
		if err != nil {
			return nil, err
		}

		n.Sender, err = m.GetUser(s)
		if err != nil {
			return nil, err
		}
		n.Receiver, err = m.GetUser(r)
		if err != nil {
			return nil, err
		}

		notifs = append(notifs, n)
	}
	return notifs, nil
}

func (m *ConnDB) SetNotification(notif *Notification) (int, error) {
	stmt := `
		INSERT INTO notifications (content, created_at, entity_type, entity_id, sender_id, receiver_id)
		VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?)
	`
	result, err := m.DB.Exec(stmt, notif.Content, notif.EntityType, notif.EntityID, notif.Sender.Id, notif.Receiver.Id)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (m *ConnDB) ArchivedNotification(notifID int) (error) {
	stmt := `DELETE FROM notifications WHERE id = ?`
	_, err := m.DB.Exec(stmt, notifID)
	if err != nil {
		return err
	}
	return nil
}