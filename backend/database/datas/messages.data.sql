INSERT INTO messages (id_sender, id_receiver, content, message_type, created_at)
VALUES 
    (8, 12, 'Hello Bob! How are you?', 'private', '2023-02-01 08:00:00'),
    (12, 8, 'Hi Alice! I am good, thank you.', 'private', '2023-02-01 08:05:00'),
    (8, 12, 'Hi Charlie, do you have any new travel plans?', 'private', '2023-02-02 09:00:00'),
    (12, 8, 'Yes, planning a trip to Japan next month!', 'private', '2023-02-02 09:10:00'),
    (8, 12, 'Emma, could you help me with some art techniques?', 'private', '2023-02-03 10:00:00'),
    (12, 8, 'Sure David, I would love to help!', 'private', '2023-02-03 10:15:00'),
    (8, 12, 'Alice, I have a new business idea to discuss.', 'private', '2023-02-04 11:00:00'),
    (8, 8, 'Hello Bob!', 'group', '2023-02-01 08:00:00'),
    (12, 8, 'Hi Alice.', 'group', '2023-02-01 08:05:00'),
    (8, 8, 'Hi Charlie,?', 'group', '2023-02-02 09:00:00'),
    (12, 8, 'Yes, planning a trip to Japan next month!', 'group', '2023-02-02 09:10:00'),
    (8, 8, 'Emma, could you help me with some art techniques?', 'group', '2023-02-03 10:00:00'),
    (12, 8, 'Sure David, I would love to help!', 'group', '2023-02-03 10:15:00'),
    (8, 8, 'Alice, I have a new business idea to discuss.', 'group', '2023-02-04 11:00:00');
