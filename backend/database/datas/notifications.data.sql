INSERT INTO notifications (content, approuved, created_at, entity_type, entity_id, sender_id, receiver_id)
VALUES 
    ('send new message', false, '2023-08-25 10:30:00', 'message', 1, 1, 10),
    ('want to follow you', true, '2023-08-25 11:00:00', 'follow', 2, 2, 3),
    ('want to join your group.', false, '2023-08-25 11:30:00', 'group', 3, 3, 10),
    ('want to follow you', false, '2023-08-25 12:00:00', 'follow', 4, 4, 10),
    ('send new message', false, '2023-08-25 12:30:00', 'message', 5, 5, 10);
