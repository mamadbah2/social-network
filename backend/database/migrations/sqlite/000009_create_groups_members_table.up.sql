CREATE TABLE groups_members (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_group INTEGER NOT NULL,
    id_member INTEGER NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    joined_at DATETIME NOT NULL,
    state TEXT NOT NULL,
    FOREIGN KEY (id_group) REFERENCES groups(id),
    FOREIGN KEY (id_member) REFERENCES users(id)
);
