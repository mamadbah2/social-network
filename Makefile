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

migrate_friends:
	sqlite3 backend/database/social.network.db < backend/database/migrations/sqlite/000013_create_notifications_table.down.sql 
	sqlite3 backend/database/social.network.db < backend/database/migrations/sqlite/000013_create_notifications_table.up.sql 
	sqlite3 backend/database/social.network.db < backend/database/migrations/sqlite/000010_create_follows_table.down.sql
	sqlite3 backend/database/social.network.db < backend/database/migrations/sqlite/000010_create_follows_table.up.sql 
	sqlite3 backend/database/social.network.db < backend/database/datas/follows.data.sql;
	sqlite3 backend/database/social.network.db < backend/database/datas/notifications.data.sql;


migrate_posts:
	sqlite3 social.network.db < migrations/sqlite/000002_create_posts_table.down.sql 
	sqlite3 social.network.db < migrations/sqlite/000002_create_posts_table.up.sql 
	sqlite3 social.network.db < datas/posts.data.sql 

# insertion de données fictive dans la bdd s'appelle du datebase_seeding
datebase_seeding:
	sqlite3 backend/database/social.network.db < backend/database/datas/default.data.sql;
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
	sqlite3 backend/database/social.network.db < backend/database/datas/notifications.data.sql;


.PHONY: create_migration migrate_up migrate_down