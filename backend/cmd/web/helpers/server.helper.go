package helpers

import (
	"fmt"
	"net/http"
	"runtime/debug"
)


// handler of the error server
func (help *Helpers) ServerError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	help.ErrorLog.Output(2, trace)
	w.WriteHeader(http.StatusInternalServerError)
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}