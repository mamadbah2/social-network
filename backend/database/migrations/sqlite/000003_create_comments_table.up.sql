CREATE TABLE comments (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_author INTEGER NOT NULL,
    id_post INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_name VARCHAR(120),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_author) REFERENCES users(id),
    FOREIGN KEY (id_post) REFERENCES posts(id)
);
