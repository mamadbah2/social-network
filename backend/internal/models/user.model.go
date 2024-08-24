package models

import (
	"database/sql"
	"errors"
	"fmt"
	"social-network/cmd/web/validators"
	"strings"
	"time"

	"github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

// Ceci n'est pas un model officiel mais un exemple

type User struct {
	Id             int
	Email          string
	Password       string
	FirstName      string
	LastName       string
	Nickname       string
	DateOfBirth    time.Time
	ProfilePicture string
	AboutMe        string
	Private        bool
	CreatedAt      time.Time
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
		var dateOfBirthStr string
		err := rows.Scan(
			&f.Id, &f.Email, &f.Password, &f.FirstName, &f.LastName, &dateOfBirthStr, &f.ProfilePicture, &f.Nickname, &f.AboutMe, &f.Private, &f.CreatedAt)
		if err != nil {
			return nil, err
		}
		followers = append(followers, f)
	}
	return followers, nil
}

func (m *ConnDB) getGroups(userID int) ([]*Group, error) {
	query := `
		SELECT g.id, g.name, g.description , g.created_at,
		 u.id, u.email, u.first_name, u.last_name,  u.nickname,u.date_of_birth, 
		 u.profile_picture, u.about_me, u.profile_privacy,
		 u.created_at
		FROM groups g
		JOIN users u ON g.id_creator = u.id
		JOIN groups_members gm ON g.id = gm.id_group
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
		var dateOfBirthStr string

		err := rows.Scan(
			&g.Id, &g.Name, &g.Description, &g.CreatedAt,
			&g.Creator.Id, &g.Creator.Email, &g.Creator.FirstName, &g.Creator.LastName,
			&g.Creator.Nickname, &dateOfBirthStr, &g.Creator.ProfilePicture,
			&g.Creator.AboutMe, &g.Creator.Private, &g.Creator.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		groups = append(groups, g)
	}
	return groups, nil
}

func (m *ConnDB) GetPosts(userID int) ([]*Post, error) {
	query := `
        SELECT p.id, p.title, p.content, p.privacy, p.created_at,
		 g.id, g.name, g.description, p.created_at, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at
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
		// var dateOfBirthStr string

		err := rows.Scan(
			&p.Id, &p.Title, &p.Content, &p.Privacy, &p.CreatedAt,
			&p.Group.Id, &p.Group.Name, &p.Group.Description, &p.Group.CreatedAt,
			&p.Author.Id, &p.Author.Email, &p.Author.Password, &p.Author.FirstName, &p.Author.LastName,
			&p.Author.DateOfBirth, &p.Author.ProfilePicture, &p.Author.Nickname,
			&p.Author.AboutMe, &p.Author.Private, &p.Author.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (m *ConnDB) GetAllUsers() ([]*User, error) {
	statement := `
		SELECT u.id, u.email,
		u.first_name, u.last_name, u.date_of_birth, 
		u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		u.created_at FROM users u
	`

	rows, err := m.DB.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User

	for rows.Next() {
		u := &User{}
		// var dateOfBirthStr string
		err := rows.Scan(&u.Id, &u.Email, &u.FirstName, &u.LastName, &u.DateOfBirth, &u.ProfilePicture, &u.Nickname, &u.AboutMe, &u.Private, &u.CreatedAt)
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

		posts, err := m.GetPosts(u.Id)
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
		SELECT u.id, u.email,
		u.password, u.first_name, u.last_name, u.date_of_birth, 
		u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		u.created_at FROM users u WHERE u.id = ?
	`
	row := m.DB.QueryRow(statement, userID)

	u := &User{}
	// var dateOfBirthStr string

	err := row.Scan(&u.Id, &u.Email, &u.Password, &u.FirstName, &u.LastName, &u.DateOfBirth, &u.ProfilePicture, &u.Nickname, &u.AboutMe, &u.Private, &u.CreatedAt)
	if err != nil {
		fmt.Println("bobo choked")
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
	
	posts, err := m.GetPosts(u.Id)
	if err != nil {
		
		return nil, err
	}
	u.Posts = posts
	
	return u, nil
}

func (m *ConnDB) SetUser(user *User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	stmt := `INSERT INTO users (email, password, first_name, last_name, date_of_birth, profile_picture, nickname, about_me, profile_privacy, created_at)
 	VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?,CURRENT_TIMESTAMP)`

	result, err := m.DB.Exec(stmt, user.Email, string(hashedPassword), user.FirstName, user.LastName, user.DateOfBirth, user.ProfilePicture, user.Nickname, user.AboutMe, user.Private)
	if err != nil {
		if sqliteErr, ok := err.(sqlite3.Error); ok {
			if sqliteErr.Code == sqlite3.ErrConstraint && strings.Contains(sqliteErr.Error(), "UNIQUE constraint failed: user.email") {
				return errors.New("models: duplicate email")
			}
		}
		fmt.Println("Error inserting user:", err)
		return err
	}
	rowsAffected, _ := result.RowsAffected()
	fmt.Println("Rows affected:", rowsAffected)
	return nil
}

func (m *ConnDB) Authenticate(emailOrUsername, password string) (int, error) {
	var id int
	var passwordeu string
	var stmt string
	if validators.Matches(emailOrUsername, validators.EmailRX) {
		stmt = `SELECT id, password FROM users WHERE email = ?`
	} else {
		stmt = `SELECT id, password FROM users WHERE nickname = ?`
	}
	err := m.DB.QueryRow(stmt, emailOrUsername).Scan(&id, &passwordeu)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			fmt.Println("error 1")
			return 0, errors.New("models: invalid credentials")
		} else {
			fmt.Println("error 2")
			return 0, err
		}
	}
	err = bcrypt.CompareHashAndPassword([]byte(passwordeu), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, errors.New("models: invalid credentials")
		} else {
			fmt.Println("error 4")
			return 0, err
		}
	}
	return id, nil

}

func (m *ConnDB) CheckNickname(nickname string) (bool, error) {
	var record int
	// Prepare a query to check if the username exists
	stmt := `SELECT count(*) FROM users WHERE nickname = ?`
	err := m.DB.QueryRow(stmt, nickname).Scan(&record)
	if err != nil {
		return false, err
	}
	return record == 0, nil
}

func (m *ConnDB) CheckEmail(email string) (bool, error) {
	var record int
	// Prepare a query to check if the username exists
	stmt := `SELECT count(*) FROM users WHERE email = ?`
	err := m.DB.QueryRow(stmt, email).Scan(&record)
	if err != nil {
		return false, err
	}
	return record == 0, nil
}
