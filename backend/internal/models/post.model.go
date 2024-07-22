package models

import "time"

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

func (m *ConnDB) SetPost(title, content, imageName, privacy string, userId, groupId int) (int, error) {
	statement := `INSERT INTO posts (title, content, image_name, privacy, created_at, id_author, id_group) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`
	result, err := m.DB.Exec(statement, title, content, imageName, privacy, userId, groupId)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
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
	var createdAt time.Time
	err := row.Scan(&p.Id, &p.Title, &p.Content, &p.Privacy, &createdAt, &p.Author.Id, &p.Group.Id)
	if err != nil {
		return nil, err
	}
	p.CreatedAt = createdAt
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
		p := &Post{}
		var createdAt time.Time
		err := rows.Scan(&p.Id, &p.Title, &p.Content, &p.Privacy, &createdAt, &p.Author.Id, &p.Group.Id)
		if err != nil {
			return nil, err
		}
		p.CreatedAt = createdAt
		posts = append(posts, p)
	}
	return posts, nil
}

// func (m *ConnDB) getPostWithDetails(postId int) (*Post, error) {
// 	post, err := m.getPost(postId)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Récupérer les détails de l'auteur
// 	author, err := m.getUser(post.Author.Id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	post.Author = author

// 	// Récupérer les détails du groupe
// 	if post.Group.Id != 0 {
// 		group, err := m.getGroup(post.Group.Id)
// 		if err != nil {
// 			return nil, err
// 		}
// 		post.Group = group
// 	}

// 	return post, nil
// }
