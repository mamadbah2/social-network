# Define the variable for the migration name
migrationName ?= default_migration_name

install_migrate:
	go install -tags 'sqlite3' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

create_migration:
	migrate create -ext sql -dir backend/database/migrations/sqlite -seq $(migrationName)

migrate_up:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite up

migrate_down:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite down

migrate_last_up:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite up 1

migrate_last_down:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite down 1

.PHONY: create_migration migrate_up migrate_down