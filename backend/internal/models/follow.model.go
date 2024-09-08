package models

import (
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

func (m *ConnDB) SetFollower(followerID, followedID int, archived bool) error {
	if followerID == followedID {
		return ErrSelfFollow
	}
	
	// Take all post ids of the followed user
	privatePostIDs, err := m.GetAllIdPrivatePost(followedID)
	if err != nil {
		return err
	}
	if !archived {
		// Check if the follow already exists
		stmt := `SELECT COUNT(*) FROM follows WHERE id_follower = ? AND id_followed = ?`
		row := m.DB.QueryRow(stmt, followerID, followedID)
		var count int
		row.Scan(&count)


		// If the follow does not exist, create it
		if count == 0 {
			stmt := `
				INSERT INTO follows (id_follower, id_followed, archived, created_at)
				VALUES (?, ?, 0, CURRENT_TIMESTAMP)
			`
			_, err := m.DB.Exec(stmt, followerID, followedID)
			if err != nil {
				return fmt.Errorf("error creating new follow: %w", err)
			}
		} else { // If the follow already exists, update it
			stmt := `
				UPDATE follows
				SET archived = 0
				WHERE id_follower = ? AND id_followed = ?
			`
			_, err := m.DB.Exec(stmt, followerID, followedID)
			if err != nil {
				return fmt.Errorf("error updating follow: %w", err)
			}
		}
		
		// Add the private posts of the followed user to the follower's feed
		for _, postID := range privatePostIDs {
			_, err := m.SetPostViewer(postID, followerID)
			if err != nil {
				return err
			}
		}
		return nil

	} else { // If the follow is archived, update it
		stmt := `
			UPDATE follows
			SET archived = 1
			WHERE id_follower = ? AND id_followed = ?
		`
		_, err := m.DB.Exec(stmt, followerID, followedID)
		if err != nil {
			return fmt.Errorf("error archiving follow: %w", err)
		}

		// Remove the private posts of the followed user from the follower's feed
		for _, postID := range privatePostIDs {
			err = m.RemovePostViewers(postID, followerID)
			if err != nil {
				return nil
			}
		}

		return nil
	}

}

func (m *ConnDB)GetAllIdPrivatePost(userID int) ([]int, error) {
	stmt := `
		SELECT p.id
		FROM posts p
		WHERE p.id_author = ? AND p.privacy = 'private'
	`
	rows, err := m.DB.Query(stmt, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var privatePosts []int
	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return nil, err
		}
		privatePosts = append(privatePosts, id)
	}
	return privatePosts, nil
}

func (m *ConnDB) GetFollowers(userID int) ([]*Follow, error) {
	query := `
	SELECT f.id, u.*
	FROM users u
	JOIN follows f ON u.id = f.id_follower
	WHERE f.id_followed = ? AND f.archived = 0
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
	WHERE f.id_follower = ? AND f.archived = 0
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
		var dateOfBirthFollowerStr string
		err := rows.Scan(
			&f.Id, &f.Followed.Id, &f.Followed.Email, &f.Followed.Password, &f.Followed.FirstName, &f.Followed.LastName, &f.Followed.DateOfBirth, &f.Followed.ProfilePicture, &f.Followed.Nickname, &f.Followed.AboutMe, &f.Followed.Private, &f.Followed.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		f.Followed.DateOfBirth, err = time.Parse("2006-01-02", dateOfBirthFollowerStr)
		if err != nil {
			return nil, err
		} 
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
			WHERE f.id_follower = ? AND f.archived = 0
		) 
		AND u.id != ? AND u.id != 0;
	`

	rows, err := m.DB.Query(stmt, userID, userID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	pendingFollows, err := m.GetPendingFollow()
	if err != nil {
		return nil, err
	}

	var friends []*User
	for rows.Next() {
		add := true
		f := &User{}
		err := rows.Scan(
			&f.Id, &f.Email, &f.FirstName, &f.LastName, &f.Nickname,
			&f.ProfilePicture, &f.Private, &f.AboutMe, &f.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		for _, id := range pendingFollows {
			if f.Id == id {
				add = false
				break
			}
		}
		if add {
			friends = append(friends, f)
		}
	}

	return friends, nil
}

func (m *ConnDB) GetPendingFollow() ([]int, error) {
	stmt := `
		SELECT n.receiver_id FROM notifications n WHERE n.approuved = false AND n.entity_type = 'follow'
	`
	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pendingFollow []int
	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return nil, err
		}
		pendingFollow = append(pendingFollow, id)
	}
	return pendingFollow, nil
}

func (m *ConnDB) GetFollowersByUser(userID int) ([]*User, error) {
	query := `
        SELECT u.*
        FROM users u
        JOIN follows f ON u.id = f.id_follower
        WHERE f.id_followed = ? AND f.archived = 0
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

func (m *ConnDB) GetFollowedByUser(userID int) ([]*User, error) {
	query := `
        SELECT u.*
        FROM users u
        JOIN follows f ON u.id = f.id_followed
        WHERE f.id_follower = ? AND f.archived = 0
    `

	rows, err := m.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followed []*User

	for rows.Next() {
		f := &User{}
		var dateOfBirthStr string
		err := rows.Scan(
			&f.Id, &f.Email, &f.Password, &f.FirstName, &f.LastName, &dateOfBirthStr, &f.ProfilePicture, &f.Nickname, &f.AboutMe, &f.Private, &f.CreatedAt)
		if err != nil {
			return nil, err
		}
		followed = append(followed, f)
	}
	return followed, nil
}
