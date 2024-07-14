package helpers

import (
	"net/http"
)

// handler of the error client (404, 405, etc)
func (help *Helpers) ClientError(w http.ResponseWriter, status int) {
	w.WriteHeader(status)

	
}
