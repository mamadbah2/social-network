CREATE TABLE follows (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_follower INTEGER NOT NULL,
    id_followed INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_follower) REFERENCES users(id),
    FOREIGN KEY (id_followed) REFERENCES users(id),
    UNIQUE (id_follower, id_followed)
);
