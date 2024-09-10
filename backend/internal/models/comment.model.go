package models

import (
	"time"
)

type Comment struct {
	Id            int
	Content       string
	ImageName     string
	Date          time.Time
	Liked         bool
	Disliked      bool
	NumberLike    int
	NumberDislike int
	Post          *Post
	Author        *User
}

func (m *ConnDB) SetComment(c *Comment) (int, error) {
	stmt := `INSERT INTO comments (id_author, id_post, content, image_name, created_at)
		VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)
	`

	AuthorId := c.Author.Id

	result, err := m.DB.Exec(stmt, AuthorId, c.Post.Id, c.Content, c.ImageName)

	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ConnDB) GetAllComment(postID int) ([]*Comment, error) {
	stmt := `SELECT id, id_author, id_post, content, image_name, created_at FROM comments WHERE id_post = ? ORDER BY id DESC`
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

		err := rows.Scan(&c.Id, &authorId, &c.Post.Id, &c.Content, &c.ImageName, &c.Date)
		if err != nil {
			return nil, err
		}

		// Fetch the author
		c.Author, err = m.GetUser(authorId)
		if err != nil {
			return nil, err
		}

		c.NumberLike, err = m.GetLike(c.Id, "comment")
		if err != nil {
			return nil, err
		}

		c.NumberDislike, err = m.GetDislike(c.Id, "comment")
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