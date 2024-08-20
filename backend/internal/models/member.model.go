package models

type Member struct {
	Id    int
	Group *Group
	User  *User
	State string
}

func (m *ConnDB) SetGroupMember(idUser int, idGroup int, State string) error {
	stmt := `
		INSERT INTO groups_members (id_group, id_member, joined_at, state)
		 VALUES (?, ?, CURRENT_TIMESTAMP, ?)
	`

	_, err := m.DB.Exec(stmt, idGroup, idUser, State)
	if err != nil {
		return err
	}
	return nil
}
