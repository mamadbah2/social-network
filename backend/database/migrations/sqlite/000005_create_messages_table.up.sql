CREATE TABLE messages (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_sender INTEGER NOT NULL,
    id_receiver INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_sender) REFERENCES users(id),
    FOREIGN KEY (id_receiver) REFERENCES users(id)
);
