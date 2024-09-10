CREATE TABLE event_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- AUTOINCREMENT for SQLite
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    response TEXT CHECK (response IN ('going', 'not_going')), -- Check constraint for allowed values
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE (user_id, event_id) -- Ensures a user can only respond once per event
);