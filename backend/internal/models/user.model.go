package models

import "time"

// Ceci n'est pas un model officiel mais un exemple

type User struct {
	Id             int
	Email          string
	FirstName      string
	LastName       string
	Nickname       string
	DateOfBirth    time.Time
	ProfilePicture string
	AboutMe        string
	Private        bool
	Followers      []*User
	Groups         []*Group
	Posts          []*Post
}

func (m *ConnDB) getFollowers(userID int) ([]*User, error) {
	query := `
        SELECT u.*
        FROM users u
        JOIN follows f ON u.id = f.id_follower
        WHERE f.id_followed = ?
    `

	rows, err := m.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []*User

	for rows.Next() {
		f := &User{}
		err := rows.Scan(
			&f.Id, &f.Email, &f.FirstName, &f.LastName, &f.Nickname, &f.DateOfBirth, &f.ProfilePicture, &f.AboutMe, &f.Private)
		if err != nil {
			return nil, err
		}
		followers = append(followers, f)
	}
	return followers, nil
}

func (m *ConnDB) getGroups(userID int) ([]*Group, error) {
	query := `
		SELECT g.*, u.*
		FROM groups g
		JOIN users u ON g.id_creator = u.id
		JOIN group_members gm ON g.id = gm.id_group
		WHERE gm.id_member = ?
    `

	rows, err := m.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []*Group

	for rows.Next() {

		g := &Group{Creator: &User{}}

		err := rows.Scan(
			&g.Id, &g.Name, &g.Description, &g.CreatedAt,
			&g.Creator.Id, &g.Creator.Email, &g.Creator.FirstName, &g.Creator.LastName,
			&g.Creator.Nickname, &g.Creator.DateOfBirth, &g.Creator.ProfilePicture,
			&g.Creator.AboutMe, &g.Creator.Private,
		)
		if err != nil {
			return nil, err
		}

		groups = append(groups, g)
	}
	return groups, nil
}

func (m *ConnDB) getPosts(userID int) ([]*Post, error) {
	query := `
        SELECT p.*, g.*, u.*
        FROM posts p
		JOIN groups g ON g.id = p.id_group
		JOIN users u ON u.id = p.id_author
        WHERE p.id_author = ?
    `

	rows, err := m.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*Post
	for rows.Next() {
		p := &Post{
			Author: &User{},
			Group:  &Group{},
		}
		err := rows.Scan(
			&p.Id, &p.Title, &p.Content, &p.Privacy, &p.CreatedAt,
			&p.Group.Id, &p.Group.Name, &p.Group.Description, &p.Group.CreatedAt,
			&p.Author.Id, &p.Author.Email, &p.Author.FirstName, &p.Author.LastName,
			&p.Author.Nickname, &p.Author.DateOfBirth, &p.Author.ProfilePicture,
			&p.Author.AboutMe, &p.Author.Private,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (m *ConnDB) GetAllUsers() ([]*User, error) {
	statement := "SELECT * FROM users"

	rows, err := m.DB.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User

	for rows.Next() {
		u := &User{}

		err := rows.Scan(&u.Id, &u.Email, &u.FirstName, &u.LastName, &u.Nickname, &u.DateOfBirth, &u.ProfilePicture, &u.AboutMe, &u.Private)
		if err != nil {
			return nil, err
		}

		followers, err := m.getFollowers(u.Id)
		if err != nil {
			return nil, err
		}
		u.Followers = followers

		groups, err := m.getGroups(u.Id)
		if err != nil {
			return nil, err
		}
		u.Groups = groups

		posts, err := m.getPosts(u.Id)
		if err != nil {
			return nil, err
		}
		u.Posts = posts

		users = append(users, u)
	}

	return users, nil
}

func (m *ConnDB) GetUser(userID int) (*User, error) {
	statement := `
		SELECT * FROM users WHERE id = ?
	`
	row := m.DB.QueryRow(statement, userID)
	u := &User{}

	err := row.Scan(&u.Id, &u.Email, &u.FirstName, &u.LastName, &u.Nickname, &u.DateOfBirth, &u.ProfilePicture, &u.AboutMe, &u.Private)
	if err != nil {
		return nil, err
	}

	followers, err := m.getFollowers(u.Id)
	if err != nil {
		return nil, err
	}
	u.Followers = followers

	groups, err := m.getGroups(u.Id)
	if err != nil {
		return nil, err
	}
	u.Groups = groups

	posts, err := m.getPosts(u.Id)
	if err != nil {
		return nil, err
	}
	u.Posts = posts

	return u, nil
}
