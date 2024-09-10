CREATE TABLE reactions (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_entity INTEGER NOT NULL,
    reaction_type VARCHAR(50) NOT NULL CHECK (reaction_type IN ('post', 'comment', 'event')),
    liked BOOLEAN DEFAULT FALSE,
    disliked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_entity) REFERENCES posts(id)
);
