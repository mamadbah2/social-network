package validators

import (
	"database/sql"
	"social-network/cmd/web/helpers"
)

type Validator struct {
	FieldErrors map[string]string
	Helpers     *helpers.Helpers
	DB          *sql.DB
}
