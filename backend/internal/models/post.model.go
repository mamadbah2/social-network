package models

import (
	"database/sql"
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

func (m *ConnDB) GetPost(postId int) (*Post, error) {
	statement := `
		SELECT p.id, p.title, p.content, p.privacy, p.created_at, 
		       u.id, u.email, u.first_name, u.last_name, u.nickname, u.profile_picture, u.about_me,
		       g.id, g.name, g.description
		FROM posts p
		JOIN users u ON p.id_author = u.id
		LEFT JOIN groups g ON p.id_group = g.id
		WHERE p.id = ?
	`
	row := m.DB.QueryRow(statement, postId)

	p := &Post{
		Author: &User{},
		Group:  &Group{},
	}
	err := row.Scan(&p.Id, &p.Title, &p.Content, &p.Privacy, &p.CreatedAt,
		&p.Author.Id, &p.Author.Email, &p.Author.FirstName, &p.Author.LastName, &p.Author.Nickname, &p.Author.ProfilePicture, &p.Author.AboutMe,
		&p.Group.Id, &p.Group.Name, &p.Group.Description)
	if err != nil {
		return nil, err
	}

	// Fetch comments
	comments, err := m.GetAllComment(p.Id)
	if err != nil {
		return nil, err
	}
	p.Comments = comments

	// Fetch viewers
	viewers, err := m.getViewersByPostId(p.Id)
	if err != nil {
		return nil, err
	}
	p.Viewers = viewers

	// Calculate likes, dislikes, and comments count
	p.NumberLike, p.NumberDislike, err = m.getCountReactionEntity(p.Id)
	if err != nil {

		return nil, err
	}

	p.NumberComment = len(p.Comments)

	return p, nil
}

func (m *ConnDB) GetAllPost() ([]*Post, error) {
	query := `
        SELECT p.id, p.title, p.content, p.privacy, p.created_at,
		 g.id, g.name, g.description, p.created_at, u.id, u.email,
		 u.password, u.first_name, u.last_name, u.date_of_birth, 
		 u.profile_picture, u.nickname, u.about_me, u.profile_privacy,
		 u.created_at
        FROM posts p
		JOIN groups g ON g.id = p.id_group
		JOIN users u ON u.id = p.id_author
    `

	rows, err := m.DB.Query(query)
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

		// Fetch comments
		comments, err := m.GetAllComment(p.Id)
		if err != nil {
			return nil, err
		}
		p.Comments = comments

		// Fetch viewers
		viewers, err := m.getViewersByPostId(p.Id)
		if err != nil {
			return nil, err
		}
		p.Viewers = viewers

		// Calculate likes, dislikes, and comments count
		p.NumberLike, p.NumberDislike, err = m.getCountReactionEntity(p.Id)
		if err != nil {
			return nil, err
		}

		p.NumberComment = len(p.Comments)

		posts = append(posts, p)
	}

	return posts, nil
}

func (m *ConnDB) getViewersByPostId(postId int) ([]*User, error) {
	statement := `
		SELECT u.id, u.email, u.first_name, u.last_name, u.nickname, u.profile_picture, u.about_me
		FROM post_visibility v
		JOIN users u ON v.id_viewer = u.id
		WHERE v.id_post = ?
	`
	rows, err := m.DB.Query(statement, postId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var viewers []*User
	for rows.Next() {
		u := &User{}
		err := rows.Scan(&u.Id, &u.Email, &u.FirstName, &u.LastName, &u.Nickname, &u.ProfilePicture, &u.AboutMe)
		if err != nil {
			return nil, err
		}
		viewers = append(viewers, u)
	}

	return viewers, nil
}

func (m *ConnDB) getCountReactionEntity(postId int) (int, int, error) {
	statement := `
		SELECT 
			COUNT(CASE WHEN liked = TRUE THEN 1 END) AS like_count,
			COUNT(CASE WHEN disliked = TRUE THEN 1 END) AS dislike_count
		FROM reactions
		WHERE id_entity = ?
	`

	var likeCount, dislikeCount int
	err := m.DB.QueryRow(statement, postId).Scan(&likeCount, &dislikeCount)
	if err != nil {
		if err == sql.ErrNoRows {
			// No reactions found for the entity, return 0 counts
			return 0, 0, nil
		}
		return 0, 0, err
	}

	return likeCount, dislikeCount, nil
}
