CREATE TABLE post_visibility (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_post INTEGER NOT NULL,
    id_viewer INTEGER NOT NULL,
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_viewer) REFERENCES users(id)
);
