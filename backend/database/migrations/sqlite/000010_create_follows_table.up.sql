CREATE TABLE follows (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_follower INTEGER NOT NULL,
    id_followed INTEGER NOT NULL,
    state VARCHAR(50) NOT NULL CHECK (state IN ('follow', 'pending', 'unfollow')),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_follower) REFERENCES users(id),
    FOREIGN KEY (id_followed) REFERENCES users(id)
);
