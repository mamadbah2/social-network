CREATE TABLE events (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    id_creator INTEGER NOT NULL,
    id_group INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    FOREIGN KEY (id_creator) REFERENCES users(id),
    FOREIGN KEY (id_group) REFERENCES groups(id)
);