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

	stmt := `SELECT id, id_author, id_post, content, created_at FROM comments WHERE id_post = ?
	`

	rows, err := m.DB.Query(stmt, postID)

	if err != nil {
		return nil, err
	}

	var AuthorId int
	var PostId int
	var AllComments []*Comment
	c := &Comment{}

	for rows.Next() {
		rows.Scan(&c.Id, &AuthorId, &PostId, &c.Content, &c.Date)

		c.Author, err = m.GetUser(AuthorId)
		if err != nil {
			return nil, err
		}

		c.Post, err = m.getPost(AuthorId)
		if err != nil {
			return nil, err
		}

		AllComments = append(AllComments, c)
	}

	return AllComments, nil
}
