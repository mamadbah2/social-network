INSERT INTO follows (id_follower, id_followed, state, created_at)
VALUES 
    (1, 2, 'follow', '2023-04-01 10:00:00'),
    (2, 3, 'unfollow', '2023-04-02 11:00:00'),
    (3, 4, 'pending', '2023-04-03 12:00:00'),
    (4, 5, 'follow', '2023-04-04 13:00:00'),
    (5, 6, 'pending', '2023-04-05 14:00:00'),
    (6, 1, 'unfollow', '2023-04-06 15:00:00');
