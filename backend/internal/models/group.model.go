package models

import (
	"database/sql"
	"fmt"
	"sort"
	"time"
)

type Group struct {
	Id          int
	Name        string
	Description string
	Creator     *User
	CreatedAt   time.Time
	Posts       []*Post
	Members     []*User
	Events      []*Event
}

func (m *ConnDB) GetGroup(id int) (*Group, error) {
	stmt := `SELECT * FROM groups WHERE id = ?`

	row := m.DB.QueryRow(stmt, id)

	g := &Group{}
	var CreatorId int

	err := row.Scan(&g.Id, &CreatorId, &g.Name, &g.Description, &g.CreatedAt)
	if err != nil {
		fmt.Println("group: ", err)
		return nil, err
	}

	g.Creator, err = m.GetUser(CreatorId)
	if err != nil {
		fmt.Println("group: ", err)
		return nil, err
	}

	// Posts, Members, and Events
	var postID, userId sql.NullInt64
	var EventID sql.NullInt64

	stmt = `
    SELECT p.id, m.id_member, e.id
    FROM groups_members m
    LEFT JOIN posts p ON p.id_group = m.id_group
    LEFT JOIN events e ON e.id_group = m.id_group
    WHERE m.id_group = ?;
    `
	rows, errRows := m.DB.Query(stmt, id)
	if errRows != nil {
		fmt.Println("Error in query:", errRows)
		return nil, errRows
	}

	for rows.Next() {
		err := rows.Scan(&postID, &userId, &EventID)
		if err != nil {
			fmt.Println("Error scanning row:", err)
			return nil, err
		}

		// Check if postID is valid
		if postID.Valid {
			Post, err := m.GetPost(int(postID.Int64))
			if err != nil {
				fmt.Println("Error fetching post:", err)
				return nil, err
			}
			g.Posts = append(g.Posts, Post)
		}

		// Check if userId is valid
		if userId.Valid {
			Member, err := m.GetUser(int(userId.Int64))
			if err != nil {
				fmt.Println("group: ", err)
				return nil, err
			}
			g.Members = append(g.Members, Member)
		}

		// Check if EventID is valid
		if EventID.Valid {
			Event, err := m.GetEvent(int(EventID.Int64))
			if err != nil {
				fmt.Println("Error fetching event:", err)
				return nil, err
			}
			g.Events = append(g.Events, Event)
		}
	}

	return g, nil
}

func (m *ConnDB) SetGroup(g *Group) error {
	stmt := `INSERT INTO groups (id_creator, name, description, created_at)
		VALUES(?, ?, ?, CURRENT_TIMESTAMP)
	`

	_, err := m.DB.Exec(stmt, g.Creator.Id, g.Name, g.Description)

	if err != nil {
		return err
	}

	return nil
}

func (m *ConnDB) GetAllGroups() ([]*Group, error) {
	stmt := `SELECT * FROM groups WHERE id != 0 ORDER BY created_at DESC`

	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}

	var AllGroups []*Group
	var CreatorId int

	for rows.Next() {
		g := &Group{}

		err = rows.Scan(&g.Id, &CreatorId, &g.Name, &g.Description, &g.CreatedAt)
		if err != nil {
			return nil, err
		}

		g.Creator, err = m.GetUser(CreatorId)
		if err != nil {
			return nil, err
		}

		AllGroups = append(AllGroups, g)
	}

	return AllGroups, nil
}

func (m *ConnDB) GetGroupsByUser(userID int) ([]*Group, error) {
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

func (m *ConnDB) GetAllGroupsPosts(groups []*Group) []*Post {
	var allPosts []*Post

	// Iterate over each group and collect all posts
	for _, group := range groups {
		allPosts = append(allPosts, group.Posts...)
	}

	// Sort all posts by CreatedAt in descending order (newest first)
	sort.Slice(allPosts, func(i, j int) bool {
		return allPosts[i].CreatedAt.After(allPosts[j].CreatedAt)
	})
	fmt.Println("posts:", allPosts)
	// Now allPosts contains all posts sorted by CreatedAt
	return allPosts
}

func (m *ConnDB) UpdateGroup(id int) error {
	// when we will find it usefull i will update this function
	return nil
}
