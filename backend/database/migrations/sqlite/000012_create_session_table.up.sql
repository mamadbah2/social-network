CREATE TABLE session (
    id TEXT PRIMARY KEY NOT NULL,
    userId INTEGER NOT NULL,
    data BLOB NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    isactive BOOLEAN NOT NULL
);