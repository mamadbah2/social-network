package models

import (
	"database/sql"
	"errors"
	"log"
)

type Reaction struct {
	Id            int
	Liked         bool
	Disliked      bool
	Id_entity     int
	Reaction_type string
	Post          *Post
	Comment       *Comment
	Author        *User
}

func (r *ConnDB) InsertReaction(id_entity, UserID int, reaction_type string, liked bool, disliked bool) error {
	stmt := `INSERT INTO reactions ( id_user, id_entity, reaction_type, liked, disliked) VALUES (?, ?, ?, ?, ?)`
	_, err := r.DB.Exec(stmt, UserID, id_entity, reaction_type, liked, disliked)
	if err != nil {
		return err
	}
	return nil
}

func (r *ConnDB) UpdateReaction(id_entity, UserID int, reaction_type string, liked bool, disliked bool) error {
	stmt := `UPDATE reactions SET liked = ?, disliked = ? WHERE id_entity = ? AND id_user = ? AND reaction_type = ?`
	_, err := r.DB.Exec(stmt, liked, disliked, id_entity, UserID, reaction_type)
	if err != nil {
		log.Println("error is", err)
		return err
	}
	return nil
}

func (r *ConnDB) CheckReaction(id_entity, UserID int, reaction_type string) (*Reaction, error) {
	stmt := `SELECT id, liked, disliked FROM reactions WHERE id_entity = ? AND id_user = ? AND reaction_type = ?`
	row := r.DB.QueryRow(stmt, id_entity, UserID, reaction_type)
	reaction := &Reaction{}
	err := row.Scan(&reaction.Id, &reaction.Liked, &reaction.Disliked)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return  &Reaction{
				Liked:   false,
				Disliked: false,
			}, nil
		} else {

			return nil, err
		}
	}
	return reaction, nil
}

func (r *ConnDB) CheckLikeReaction(id_entity, UserID int, reaction_type string) (*Reaction, error) {
	stmt := `SELECT liked FROM reactions WHERE id_entity = ? AND id_user = ? AND reaction_type = ?`
	row := r.DB.QueryRow(stmt, id_entity, UserID, reaction_type)
	reaction := &Reaction{}
	err := row.Scan(&reaction.Liked)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		} else {

			return nil, err
		}
	}
	return reaction, nil
}

func (r *ConnDB) CheckDislikeReaction(id_entity, UserID int, reaction_type string) (*Reaction, error) {
	stmt := `SELECT disliked FROM reactions WHERE id_entity = ? AND id_user = ? AND reaction_type = ?`
	row := r.DB.QueryRow(stmt, id_entity, UserID, reaction_type)
	reaction := &Reaction{}
	err := row.Scan(&reaction.Disliked)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		} else {
			return nil, err
		}
	}
	return reaction, nil
}

func (r *ConnDB) GetLike(id_entity int, reaction_type string) (int, error) {
	stmt := `SELECT COUNT(*) FROM reactions WHERE id_entity = ? AND liked = true AND reaction_type = ?`
	row := r.DB.QueryRow(stmt, id_entity, reaction_type)
	var likes int
	err := row.Scan(&likes)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrNoRecord
		} else {
			return 0, err
		}
	}
	return likes, nil
}

func (r *ConnDB) GetDislike(id_entity int, reaction_type string) (int, error) {
	stmt := `SELECT COUNT(*) FROM reactions WHERE id_entity = ? AND disliked = true AND reaction_type = ?`
	row := r.DB.QueryRow(stmt, id_entity, reaction_type)
	var dislikes int
	err := row.Scan(&dislikes)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrNoRecord
		} else {
			return 0, err
		}
	}
	return dislikes, nil
}
