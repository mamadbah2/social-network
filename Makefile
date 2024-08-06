# Define the variable for the migration name
migrationName ?= default_migration_name

create_migration:
	migrate create -ext sql -dir backend/database/migrations/sqlite -seq $(migrationName)

migrate_up:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite up

migrate_down:
	migrate -database "sqlite3://./backend/database/social.network.db" -path ./backend/database/migrations/sqlite down

# insertion de données fictive dans la bdd s'appelle du datebase_seeding
datebase_seeding:
	sqlite3 backend/database/social.network.db < backend/database/datas/events.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/follows.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/groups_members.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/groups.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/messages.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/post_visibility.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/posts.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/reactions.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/users.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/comments.data.sql;


.PHONY: create_migration migrate_up migrate_down