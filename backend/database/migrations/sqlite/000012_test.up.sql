INSERT INTO follows (id_follower, id_followed, created_at)
VALUES 
    (1, 2, '2023-04-01 10:00:00'),
    (2, 3, '2023-04-02 11:00:00'),
    (3, 4, '2023-04-03 12:00:00'),
    (4, 5, '2023-04-04 13:00:00'),
    (5, 6, '2023-04-05 14:00:00');

INSERT INTO users (email, password, first_name, last_name, date_of_birth, profile_picture, nickname, about_me, profile_privacy, created_at)
VALUES 
    ('alice.smith@example.com', 'MotDePasse123', 'Alice', 'Smith', '1995-07-21', 'https://example.com/profiles/alice.jpg', 'alicemith', 'Love hiking and outdoor adventures', 0, '2023-01-15 10:00:00'),
    ('bob.johnson@example.com', 'Secret456', 'Bob', 'Johnson', '1990-12-05', 'https://example.com/profiles/bob.jpg', 'bobohnson', 'Tech enthusiast and gamer', 0, '2023-01-16 11:00:00'),
    ('fatima@fatima.gn', '$2a$12$S3254YLmkrIEOXmdYXo73OL6URt9Y.ccelnjwMsenQxvH8VlRymby', 'Fatima', 'Gn', '1984-03-17', 'https://example.com/profiles/fatima.jpg', 'fatima', 'Travel blogger and photographer', 0, '2023-01-17 12:00:00'),
    ('charlie.brown@example.com', 'P@ssw0rd', 'Charlie', 'Brown', '1992-11-02', 'https://example.com/profiles/charlie.jpg', 'charliebrown', 'Avid reader and writer', 0, '2023-01-18 13:00:00'),
    ('david.miller@example.com', 'Secure789', 'David', 'Miller', '1985-04-25', 'https://example.com/profiles/david.jpg', 'davidmiller', 'Fitness coach and nutritionist', 0, '2023-01-19 14:00:00'),
    ('emma.white@example.com', 'Confidential987', 'Emma', 'White', '2001-08-30', 'https://example.com/profiles/emma.jpg', 'emmawhite', 'Art lover and painter', 0, '2023-01-20 15:00:00'),
    ('bahs@gmail.com', '$2a$12$Sa.9gDTECdrMfKK/rWYaHuUJZtzgnmiwk9i7mroAzUyscgsDDo4Zy', 'Mamadou', 'BAH', '1978-09-15', 'https://example.com/profiles/mamadou.jpg', 'bobodenar', 'Entrepreneur and investor', 0, '2023-01-21 16:00:00');

INSERT INTO groups (id_creator, name, description, created_at)
VALUES 
    (1, 'Adventure Club', 'Group for adventure enthusiasts', '2023-02-01 10:00:00'),
    (2, 'Tech Geeks', 'Group for technology lovers', '2023-02-02 11:00:00'),
    (3, 'Travel Buddies', 'Group for people who love to travel', '2023-02-03 12:00:00'),
    (4, 'Book Worms', 'Group for book lovers', '2023-02-04 13:00:00'),
    (5, 'Fitness Freaks', 'Group for fitness enthusiasts', '2023-02-05 14:00:00');

INSERT INTO posts (id_author, id_group, title, content, privacy, created_at)
VALUES 
    (1, 1, 'Mountain Hiking Tips', 'Here are some tips for a safe and enjoyable mountain hiking experience.', 'public', '2023-03-01 10:00:00'),
    (2, 2, 'Latest Tech Trends', 'Discussion about the latest trends in technology.', 'public', '2023-03-02 11:00:00'),
    (3, 3, 'Top Travel Destinations', 'A list of top travel destinations for 2024.', 'public', '2023-03-03 12:00:00'),
    (4, 4, 'Best Books of 2023', 'Review of the best books released in 2023.', 'public', '2023-03-04 13:00:00'),
    (5, 5, 'Home Workout Routines', 'Effective home workout routines to stay fit.', 'public', '2023-03-05 14:00:00');
