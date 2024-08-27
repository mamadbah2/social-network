package models

import (
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type Follow struct {
	Id       int
	Followed *User
	Follower *User
	State    string
}

var ErrSelfFollow = errors.New("un utilisateur ne peut pas se suivre lui-même")

func (m *ConnDB) SetFollower(followerID, followedID int, state string) error {
	if followerID == followedID {
		return ErrSelfFollow
	}
	// Vérifier d'abord si une relation archivée existe
	query := `
			SELECT id FROM follows
			WHERE id_follower = ? AND id_followed = ?
	`
	var followID int
	err := m.DB.QueryRow(query, followerID, followedID).Scan(&followID)

	if err == nil {
		updateQuery := `UPDATE follows
					SET state = ?
					WHERE id = ?
			`
		_, err = m.DB.Exec(updateQuery, state, followID)
		if err != nil {
			return fmt.Errorf("error reactivating follow: %w", err)
		}
		return nil
	} else if err != sql.ErrNoRows {
		return fmt.Errorf("error checking existing follow: %w", err)
	}

	insertQuery := `
			INSERT INTO follows (id_follower, id_followed, created_at, state)
			VALUES (?, ?, CURRENT_TIMESTAMP, ?)
	`
	_, err = m.DB.Exec(insertQuery, followerID, followedID, state)
	if err != nil {
		return fmt.Errorf("error creating new follow: %w", err)
	}
	return nil
}

func (m *ConnDB) GetFollowers(userID int) ([]*Follow, error) {
	query := `
	SELECT f.id, u.*
	FROM users u
	JOIN follows f ON u.id = f.id_follower
	WHERE f.id_followed = ? AND f.state = ?
`

	rows, err := m.DB.Query(query, userID, "follow")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []*Follow

	for rows.Next() {
		f := &Follow{
			Follower: &User{},
		}
		var dateOfBirthFollowerStr string
		err := rows.Scan(
			&f.Id, &f.Follower.Id, &f.Follower.Email, &f.Follower.Password, &f.Follower.FirstName, &f.Follower.LastName, &dateOfBirthFollowerStr, &f.Follower.ProfilePicture, &f.Follower.Nickname, &f.Follower.AboutMe, &f.Follower.Private, &f.Follower.CreatedAt)
		if err != nil {
			return nil, err
		}
		f.Follower.DateOfBirth, err = time.Parse("2006-01-02", dateOfBirthFollowerStr)
		if err != nil {
			return nil, err
		}
		followers = append(followers, f)
	}
	return followers, nil
}

func (m *ConnDB) GetFollowing(userID int) ([]*Follow, error) {
	query := `
	SELECT f.id, u.*
	FROM users u
	JOIN follows f ON u.id = f.id_followed
	WHERE f.id_follower = ? AND f.state = ?
`

	rows, err := m.DB.Query(query, userID, "follow")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var Followed []*Follow

	for rows.Next() {
		f := &Follow{
			Followed: &User{},
		}
		err := rows.Scan(
			&f.Id, &f.Followed.Id, &f.Followed.Email, &f.Followed.Password, &f.Followed.FirstName, &f.Followed.LastName, &f.Followed.DateOfBirth, &f.Followed.ProfilePicture, &f.Followed.Nickname, &f.Followed.AboutMe, &f.Followed.Private, &f.Followed.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		/* f.Followed.DateOfBirth, err = time.Parse("2006-01-02", dateOfBirthFollowedStr)
		if err != nil {
			return nil, err
		} */
		Followed = append(Followed, f)
	}
	return Followed, nil
}

func (m *ConnDB) GetSuggestedFriends(userID int) ([]*User, error) {
	stmt := `
		SELECT u.id, u.email, u.first_name, u.last_name, u.nickname, 
			u.profile_picture, u.profile_privacy, u.about_me, u.created_at
		FROM users u
		WHERE u.id NOT IN (
			SELECT f.id_followed
			FROM follows f
			WHERE f.id_follower = ?
		) 
		AND u.id != ?;
	`

	
	rows, err := m.DB.Query(stmt, userID, userID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var friends []*User
	for rows.Next() {
		f := &User{}
		err := rows.Scan(
			&f.Id, &f.Email, &f.FirstName, &f.LastName, &f.Nickname,
			&f.ProfilePicture, &f.Private, &f.AboutMe, &f.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		friends = append(friends, f)
	}
	
	return friends, nil
}

func (m *ConnDB) GetFollowersByUser(userID int) ([]*User, error) {
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
