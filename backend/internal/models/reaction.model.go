package models

import (
	"database/sql"
	"errors"
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
	stmt := `INSERT INTO reaction ( id_user, id_entity, reaction_type, liked, disliked) VALUES (?, ?, ?, ?, ?)`
	_, err := r.DB.Exec(stmt, id_entity, UserID, liked, disliked)
	if err != nil {
		return err
	}
	return nil
}

func (r *ConnDB) UpdateReaction(id_entity, UserID int, reaction_type string, liked bool, disliked bool) error {
	stmt := `UPDATE reaction SET like = ?, dislike = ? WHERE id_entity = ? AND user_id = ? AND reaction_type = ?`
	_, err := r.DB.Exec(stmt, liked, disliked, id_entity, UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r *ConnDB) CheckLikeReaction(id_entity, UserID int) (*Reaction, error) {
	stmt := `SELECT liked FROM reaction WHERE id_entity = ? AND id_user = ?`
	row := r.DB.QueryRow(stmt, id_entity, UserID)
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

func (r *ConnDB) CheckDislikeReaction(id_entity, UserID int) (*Reaction, error) {
	stmt := `SELECT disliked FROM reaction WHERE id_entity = ? AND id_user = ?`
	row := r.DB.QueryRow(stmt, id_entity, UserID)
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

func (r *ConnDB) GetLike(id_entity int) (int, error) {
	stmt := `SELECT COUNT(*) FROM reaction WHERE id_entity = ? AND liked = true`
	row := r.DB.QueryRow(stmt, id_entity)
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

func (r *ConnDB) GetDislike(id_entity int) (int, error) {
	stmt := `SELECT COUNT(*) FROM reaction WHERE id_entity = ? AND disliked = true`
	row := r.DB.QueryRow(stmt, id_entity)
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
