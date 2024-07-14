package models

// Ceci n'est pas un model officiel mais un exemple

type User struct {
	Hello string
}

func (m *ConnDB) GetUser(id int) (*User, error) {

	return nil, nil
}