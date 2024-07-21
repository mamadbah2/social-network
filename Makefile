# Define the variable for the migration name
migrationName ?= default_migration_name

create_migration:
	migrate create -ext sql -dir backend/database/migrations/sqlite -seq $(migrationName)

migrate_up:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite up

migrate_down:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite down

.PHONY: create_migration migrate_up migrate_down