package models

import (
	"time"
)

type Post struct {
	Id            int
	Title         string
	Content       string
	CreatedAt     time.Time
	Privacy       string
	Author        *User
	Group         *Group
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	NumberComment int
	Comments      []*Comment
	Viewers       []*User
}

func (m *ConnDB) SetPost(title, content, imageName, privacy string, userId, groupId int, selectedFollowers []int) (int, error) {
	// Insert the post into the posts table
	statement := `INSERT INTO posts (title, content, image_name, privacy, created_at, id_author, id_group) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`
	result, err := m.DB.Exec(statement, title, content, imageName, privacy, userId, groupId)
	if err != nil {
		return 0, err
	}
	
	postId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	switch privacy {
	case "public":
		users, err := m.GetAllUsers()
		if err != nil {
			return int(postId), err
		}
		for _, user := range users {
			_, err := m.SetPostViewer(int(postId), user.Id)
			if err != nil {
				return int(postId), err
			}
		}
	case "private":
		user, err := m.GetUser(userId)
		if err != nil {
			return int(postId), err
		}
		for _, follower := range user.Followers {
			_, err := m.SetPostViewer(int(postId), follower.Id)
			if err != nil {
				return int(postId), err
			}
		}
	case "group":
		groups, err := m.GetGroup(groupId)
		if err != nil {
			return int(postId), err
		}
		for _, members := range groups.Members {
			_, err := m.SetPostViewer(int(postId), members.Id)
			if err != nil {
				return int(postId), err
			}
		}
	case "almost private":
		for _, followerId := range selectedFollowers {
			_, err := m.SetPostViewer(int(postId), followerId)
			if err != nil {
				return int(postId), err
			}
		}
	}

	return int(postId), nil
}

func (db *ConnDB) SetPostViewer(postId, userId int) (int, error) {
	query := `
		INSERT INTO post_visibility (id_post, id_viewer)
		VALUES (?, ?)`

	_, err := db.DB.Exec(query, postId, userId)
	if err != nil {
		return 0, err
	}

	return 1, nil
}

func (m *ConnDB) getPost(postId int) (*Post, error) {
	statement := `SELECT id, title, content, privacy, created_at, id_author, id_group FROM posts WHERE id = ?`
	row := m.DB.QueryRow(statement, postId)

	p := &Post{}
	err := row.Scan(&p.Id, &p.Title, &p.Content, &p.Privacy, &p.CreatedAt, &p.Author.Id, &p.Group.Id)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (m *ConnDB) GetAllPost() ([]*Post, error) {
	statement := `SELECT id, title, content, privacy, created_at, id_author, id_group FROM posts ORDER BY created_at DESC`
	rows, err := m.DB.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := []*Post{}
	for rows.Next() {
		p := &Post{
			Author: &User{},
			Group:  &Group{},
		}
		err := rows.Scan(&p.Id, &p.Title, &p.Content, &p.Privacy, &p.CreatedAt, &p.Author.Id, &p.Group.Id)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}