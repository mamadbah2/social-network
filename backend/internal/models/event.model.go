package models

type Event struct {
	Id          int
	Title       string
	Description string
	Date        string // Change from time.Time to string for easier handling
	Time        string // New field for time
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	Creator     *User
	Group       *Group
}

func (m *ConnDB) GetEvent(eventID int) (*Event, error) {
	statement := `
		SELECT e.id, e.title, e.description, e.event_date, e.event_time, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at, g.id, g.name, g.description, g.created_at
		FROM events e
		JOIN users u ON u.id = e.id_creator
		JOIN groups g ON g.id = e.id_group
		WHERE e.id = ?
	`

	row := m.DB.QueryRow(statement, eventID)

	e := &Event{
		Creator: &User{},
		Group:   &Group{},
	}

	err := row.Scan(
		&e.Id, &e.Title, &e.Description, &e.Date, &e.Time,
		&e.Creator.Id, &e.Creator.Email, &e.Creator.Password, &e.Creator.FirstName, &e.Creator.LastName,
		&e.Creator.DateOfBirth, &e.Creator.ProfilePicture, &e.Creator.Nickname,
		&e.Creator.AboutMe, &e.Creator.Private, &e.Creator.CreatedAt,
		&e.Group.Id, &e.Group.Name, &e.Group.Description, &e.Group.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	e.NumberLike, err = m.GetLike(eventID, "event")
	if err != nil {
		return nil, err
	}
	e.NumberDislike, err = m.GetDislike(eventID, "event")
	if err != nil {
		return nil, err
	}
	return e, nil
}

func (m *ConnDB) GetAllEvents() ([]*Event, error) {
	statement := `
		SELECT e.id, e.title, e.description, e.event_date, e.event_time, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at, g.id, g.name, g.description, g.created_at
		FROM events e
		JOIN users u ON u.id = e.id_creator
		JOIN groups g ON g.id = e.id_group
	`

	rows, err := m.DB.Query(statement)
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

		err := rows.Scan(
			&e.Id, &e.Title, &e.Description, &e.Date, &e.Time,
			&e.Creator.Id, &e.Creator.Email, &e.Creator.Password, &e.Creator.FirstName, &e.Creator.LastName,
			&e.Creator.DateOfBirth, &e.Creator.ProfilePicture, &e.Creator.Nickname,
			&e.Creator.AboutMe, &e.Creator.Private, &e.Creator.CreatedAt,
			&e.Group.Id, &e.Group.Name, &e.Group.Description, &e.Group.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		events = append(events, e)
	}

	return events, nil
}

func (m *ConnDB) SetEvent(e *Event) (int, error) {
	statement := `
		INSERT INTO events (id_creator, id_group, title, description, event_date, event_time) 
		VALUES (?, ?, ?, ?, ?, ?)
	`

	result, err := m.DB.Exec(statement, e.Creator.Id, e.Group.Id, e.Title, e.Description, e.Date, e.Time)
	if err != nil {
		return 0, err
	}
	Id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(Id), nil
}