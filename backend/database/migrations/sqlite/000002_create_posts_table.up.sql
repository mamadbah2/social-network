CREATE TABLE posts (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_author INTEGER NOT NULL,
    id_group INTEGER,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    privacy VARCHAR(50) NOT NULL CHECK (privacy IN ('public', 'private', 'almost private')),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_author) REFERENCES users(id),
    FOREIGN KEY (id_group) REFERENCES groups(id)
);
