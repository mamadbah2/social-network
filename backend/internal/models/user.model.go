package models

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

// Ceci n'est pas un model officiel mais un exemple

type User struct {
	Id               int
	Email            string
	Password         string
	FirstName        string
	LastName         string
	Nickname         string
	DateOfBirth      time.Time
	ProfilePicture   string
	AboutMe          string
	Private          bool
	CreatedAt        time.Time
	Followers        []*User
	Followed				 []*User
	Groups           []*Group
	Posts            []*Post
	SuggestedFriends []*User
}

func (m *ConnDB) GetPosts(userID int) ([]*Post, error) {
	query := `
        SELECT p.id, p.title, p.content, p.privacy, p.image_name, p.created_at,
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
			&p.Id, &p.Title, &p.Content, &p.Privacy, &p.ImageName, &p.CreatedAt,
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

		followers, err := m.GetFollowersByUser(u.Id)
		if err != nil {
			return nil, err
		}
		u.Followers = followers

		groups, err := m.GetGroupsByUser(u.Id)
		if err != nil {
			return nil, err
		}
		u.Groups = groups

		posts, err := m.GetPosts(u.Id)
		if err != nil {
			return nil, err
		}
		u.Posts = posts

		noFriend, err := m.GetSuggestedFriends(u.Id)
		if err != nil {
			return nil, err
		}
		u.SuggestedFriends = noFriend

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

	err := row.Scan(&u.Id, &u.Email, &u.Password, &u.FirstName, &u.LastName, &u.DateOfBirth, &u.ProfilePicture, &u.Nickname, &u.AboutMe, &u.Private, &u.CreatedAt)
	if err != nil {
		fmt.Println("bobo choked")
		return nil, err
	}

	followers, err := m.GetFollowersByUser(u.Id)
	if err != nil {
		return nil, err
	}
	u.Followers = followers

	followed, err := m.GetFollowedByUser(u.Id)
	if err != nil {
		return nil, err
	}
	u.Followed = followed

	groups, err := m.GetGroupsByUser(u.Id)
	if err != nil {
		return nil, err
	}
	u.Groups = groups

	posts, err := m.GetPosts(u.Id)
	if err != nil {
		return nil, err
	}
	u.Posts = posts

	noFriend, err := m.GetSuggestedFriends(u.Id)
	if err != nil {
		return nil, err
	}
	u.SuggestedFriends = noFriend

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
