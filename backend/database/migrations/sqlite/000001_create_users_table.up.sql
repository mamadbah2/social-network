CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATETIME NOT NULL,
    profile_picture TEXT,
    nickname VARCHAR(255) UNIQUE,
    about_me VARCHAR(255),
    profile_privacy BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL
);