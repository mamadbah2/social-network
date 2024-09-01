package models

type Member struct {
	Id    int
	Group *Group
	User  *User
}

func (m *ConnDB) SetGroupMember(idUser int, idGroup int) error {
	stmt := `
		INSERT INTO groups_members (id_group, id_member, joined_at)
		 VALUES (?, ?, CURRENT_TIMESTAMP)
	`

	_, err := m.DB.Exec(stmt, idGroup, idUser)
	if err != nil {
		return err
	}
	return nil
}
