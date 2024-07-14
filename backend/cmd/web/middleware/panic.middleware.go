package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"
)

func (middle *Middleware) PanicRecover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		
		defer func() {
			panic := recover()
			if panic != nil {
				w.Header().Set("Connection", "close")
				trace := fmt.Sprintf("%s\n%s", fmt.Errorf("%s", panic), debug.Stack())
				middle.Helpers.ErrorLog.Output(2, trace)
				w.WriteHeader(http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	})
}