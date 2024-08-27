INSERT INTO notifications (content, approuved, created_at, entity_type, entity_id, sender_id, receiver_id)
VALUES 
    ('Your post has been liked by John.', true, '2023-08-25 10:30:00', 'message', 1, 1, 2),
    ('You have a new friend request from Jane.', false, '2023-08-25 11:00:00', 'follow', 2, 2, 3),
    ('Your group invite has been accepted.', true, '2023-08-25 11:30:00', 'group', 3, 3, 4),
    ('Anna commented on your post.', false, '2023-08-25 12:00:00', 'follow', 4, 4, 5),
    ('Your profile picture was updated.', true, '2023-08-25 12:30:00', 'message', 5, 5, 6);
