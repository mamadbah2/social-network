package handlers

import (
	"errors"
	"net/http"
	"social-network/cmd/web/validators"
	"social-network/internal/models"
	"strconv"
)

func (hand *Handler) LikeReaction(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	actualUser, err := hand.ConnDB.GetUser(session.UserId)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	switch r.Method {
	case http.MethodPost:
		err = r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
			return
		}

		// Recuperation de l'id de l'entité
		id_entity, err := strconv.Atoi(r.PostForm.Get("id_entity"))
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		// Type d'entité
		reaction_type := r.PostForm.Get("reaction_type")
		hand.Valid.CheckField(validators.NotBlank(reaction_type), "reaction_type", "This field cannot be blank")

		check, err := hand.ConnDB.CheckLikeReaction(id_entity, actualUser.Id, reaction_type)
		if errors.Is(err, models.ErrNoRecord) {
			err := hand.ConnDB.InsertReaction(id_entity, actualUser.Id, reaction_type, true, false)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: true,
					Disliked: false,
				},
			)
		} else if check.Liked {
			err := hand.ConnDB.UpdateReaction(id_entity, actualUser.Id, reaction_type, false, false)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: false,
					Disliked: false,
				},
			)
		} else if !check.Liked {
			err := hand.ConnDB.UpdateReaction(id_entity, actualUser.Id, reaction_type, true, false)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: true,
					Disliked: false,
				},
			)
		}

	default:
		hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
		return
	}
}

func (hand *Handler) DislikeReaction(w http.ResponseWriter, r *http.Request) {
	// Ici logique get user de la session
	session, err := hand.ConnDB.GetSession(r)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	actualUser, err := hand.ConnDB.GetUser(session.UserId)
	if err != nil {
		hand.Helpers.ServerError(w, err)
		return
	}

	switch r.Method {
	case http.MethodPost:
		err = r.ParseForm()
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusMethodNotAllowed)
			return
		}

		// Recuperation de l'id de l'entité
		id_entity, err := strconv.Atoi(r.PostForm.Get("id_entity"))
		if err != nil {
			hand.Helpers.ClientError(w, http.StatusBadRequest)
			return
		}

		reaction_type := r.PostForm.Get("reaction_type")
		hand.Valid.CheckField(validators.NotBlank(reaction_type), "reaction_type", "This field cannot be blank")

		check, err := hand.ConnDB.CheckDislikeReaction(id_entity, actualUser.Id, reaction_type)
		if errors.Is(err, models.ErrNoRecord) {
			err := hand.ConnDB.InsertReaction(id_entity, actualUser.Id, reaction_type, false, true)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: false,
					Disliked: true,
				},
			)
		} else if check.Disliked {
			err := hand.ConnDB.UpdateReaction(id_entity, actualUser.Id, reaction_type, false, false)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: false,
					Disliked: false,
				},
			)

		} else if !check.Disliked {
			err := hand.ConnDB.UpdateReaction(id_entity, actualUser.Id, reaction_type, false, true)
			if err != nil {
				hand.Helpers.ServerError(w, err)
				return
			}
			hand.renderJSON(
				w, models.Reaction{
					Liked: false,
					Disliked: true,
				},
			)
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
