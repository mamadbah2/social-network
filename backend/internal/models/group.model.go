package models

import (
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

// Read let's go, chap 4.6: Executing SQL statements
func (m *ConnDB) GetGroup(id int) (*Group, error) {

	stmt := `SELECT * FROM groups WHERE id = ?`

	row := m.DB.QueryRow(stmt, id)

	g := &Group{}
	var CreatorId int

	err := row.Scan(&g.Id, &CreatorId, &g.Name, &g.Description, &g.CreatedAt)
	if err != nil {
		return nil, err
	}

	g.Creator, err = m.GetUser(CreatorId)
	if err != nil {
		return nil, err
	}
	//Posts, Members and Events

	var postID, userId, EventID int

	stmt = `
	SELECT p.id, m.id_member, e.id
	FROM posts p
	JOIN groups_members m ON p.id_group = m.id_group
	JOIN events e ON p.id_group = e.id_group
	WHERE p.id_group = ?;
	`
	rows, errRows := m.DB.Query(stmt, id)
	if errRows != nil {
		fmt.Println(errRows.Error())
		return nil, errRows
	}

	for rows.Next() {
		rows.Scan(&postID, &userId, &EventID)
		Post, err := m.GetPost(postID)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		Member, err := m.GetUser(userId)
		if err != nil {
			return nil, err
		}

		Event, err := m.GetEvent(EventID)
		if err != nil {
			return nil, err
		}

		g.Posts = append(g.Posts, Post)
		g.Members = append(g.Members, Member)
		g.Events = append(g.Events, Event)
	}

	return g, nil
}

func (m *ConnDB) SetGroup(g *Group) error {
	stmt := `INSERT INTO groups (id_creator, name, description)
		VALUES(?, ?, ?)
	`

	_, err := m.DB.Exec(stmt, g.Creator.Id, g.Name, g.Description)

	if err != nil {
		return err
	}

	return nil
}

func (m *ConnDB) GetAllGroups() ([]*Group, error) {
	stmt := `SELECT * FROM groups`

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
