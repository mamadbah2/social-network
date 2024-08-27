CREATE TABLE notifications (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    approuved BOOLEAN DEFAULT false,
    created_at DATETIME NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
