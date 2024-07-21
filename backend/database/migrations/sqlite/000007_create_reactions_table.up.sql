CREATE TABLE reactions (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_post INTEGER,
    id_comment INTEGER,
    like BOOLEAN DEFAULT FALSE,
    dislike BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_comment) REFERENCES comments(id)
);
