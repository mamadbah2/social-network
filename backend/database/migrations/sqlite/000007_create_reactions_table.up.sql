CREATE TABLE reactions (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_entity INTEGER,
    reaction_type VARCHAR(50) NOT NULL CHECK (type IN ('post', 'comment')),
    liked BOOLEAN DEFAULT FALSE,
    disliked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_comment) REFERENCES comments(id)
);
