package models

import (
	"time"
)

type Event struct {
	Id          int
	Title       string
	Description string
	Date        time.Time
	Creator     *User
	Group       *Group
}

func (m *ConnDB) GetEvent(eventID int) (*Event, error) {
	statement := `
		SELECT e.id, e.title, e.description, e.event_date, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at, g.id, g.name, g.description, p.created_at
		FROM event e
		JOIN users u ON u.id = e.id_creator
		JOIN groups g ON g.id = e.id_group
		WHERE e.id = ?
	`

	row := m.DB.QueryRow(statement, eventID)

	e := &Event{
		Creator: &User{},
		Group:   &Group{},
	}

	var dateOfBirthStr string

	err := row.Scan(
		&e.Id, &e.Title, &e.Description, &e.Date,
		&e.Creator.Id, &e.Creator.Email, &e.Creator.Password, &e.Creator.FirstName, &e.Creator.LastName,
		&dateOfBirthStr, &e.Creator.ProfilePicture, &e.Creator.Nickname,
		e.Creator.AboutMe, &e.Creator.Private, &e.Creator.CreatedAt,
		&e.Group.Id, &e.Group.Name, &e.Group.Description, &e.Group.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	e.Creator.DateOfBirth, err = time.Parse("2006-01-02", dateOfBirthStr)
	if err != nil {
		return nil, err
	}

	return e, nil

}

func (m *ConnDB) GetAllEvents(userID int) ([]*Event, error) {
	statement := `
		SELECT e.id, e.title, e.description, e.event_date, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at, g.id, g.name, g.description, p.created_at
		FROM event e
		JOIN users u ON u.id = e.id_creator
		JOIN groups g ON g.id = e.id_group
		WHERE u.id = ?
	`

	rows, err := m.DB.Query(statement, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*Event

	for rows.Next() {
		e := &Event{
			Creator: &User{},
			Group:   &Group{},
		}

		var dateOfBirthStr string

		err := rows.Scan(
			&e.Id, &e.Title, &e.Description, &e.Date,
			&e.Creator.Id, &e.Creator.Email, &e.Creator.Password, &e.Creator.FirstName, &e.Creator.LastName,
			&dateOfBirthStr, &e.Creator.ProfilePicture, &e.Creator.Nickname,
			e.Creator.AboutMe, &e.Creator.Private, &e.Creator.CreatedAt,
			&e.Group.Id, &e.Group.Name, &e.Group.Description, &e.Group.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		e.Creator.DateOfBirth, err = time.Parse("2006-01-02", dateOfBirthStr)
		if err != nil {
			return nil, err
		}

		events = append(events, e)
	}
	
	return events, nil

}

func (m *ConnDB) SetEvent(e *Event) (int, error) {
	statement := `
		INSERT INTO events (id_creator, id_group, title, description, event_date) 
		VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
	`

	result, err := m.DB.Exec(statement, e.Creator.Id, e.Group.Id, e.Title, e.Description)
	if err != nil {
		return 0, err
	}
	Id, err :=result.LastInsertId()
	if err != nil {
		return 0, err
	}
	
	return int(Id), nil
}