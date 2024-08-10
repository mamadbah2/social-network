INSERT INTO reactions (id_user, id_entity, reaction_type, liked, disliked)
VALUES 
    (1, 1, 'post', TRUE, FALSE),
    (2, 1, 'comment', FALSE, TRUE),
    (3, 2, 'post', TRUE, FALSE),
    (4, 3, 'post', TRUE, FALSE),
    (5, 4, 'post', FALSE, TRUE),
    (3, 5, 'comment', TRUE, FALSE),
    (7, 6, 'post', TRUE, FALSE);
