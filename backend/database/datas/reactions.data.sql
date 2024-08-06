INSERT INTO reactions (id_user, id_post, id_comment, reaction_type, like, dislike)
VALUES 
    (1, 1, NULL, 'post', TRUE, FALSE),
    (2, 1, NULL, 'comment', FALSE, TRUE),
    (3, NULL, 2, 'post', TRUE, FALSE),
    (4, 3, NULL, 'post', TRUE, FALSE),
    (5, NULL, 4, 'post', FALSE, TRUE),
    (3, 5, NULL, 'comment', TRUE, FALSE),
    (7, 6, NULL, 'post', TRUE, FALSE);
