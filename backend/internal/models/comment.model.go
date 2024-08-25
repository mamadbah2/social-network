package models

import (
	"time"
)

type Comment struct {
	Id            int
	Content       string
	Date          time.Time
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	Post          *Post
	Author        *User
}

func (m *ConnDB) SetComment(c *Comment) error {
	stmt := `INSERT INTO comments (id_author, id_post, content)
		VALUES(?, ?, ?)
	`

	AuthorId := c.Author.Id

	_, err := m.DB.Exec(stmt, AuthorId, c.Post.Id, c.Content)

	if err != nil {
		return err
	}

	return nil
}

func (m *ConnDB) GetAllComment(postID int) ([]*Comment, error) {
	stmt := `SELECT id, id_author, id_post, content, created_at FROM comments WHERE id_post = ?`
	rows, err := m.DB.Query(stmt, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var allComments []*Comment
	for rows.Next() {
		c := &Comment{
			Post: &Post{},
			Author: &User{},
		}
		var authorId int

		err := rows.Scan(&c.Id, &authorId, &c.Post.Id, &c.Content, &c.Date)
		if err != nil {
			return nil, err
		}

		// Fetch the author
		c.Author, err = m.GetUser(authorId)
		if err != nil {
			return nil, err
		}

		allComments = append(allComments, c)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return allComments, nil
}