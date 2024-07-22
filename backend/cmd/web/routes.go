package main

import (
	"net/http"
)

func (app *Application) routes() http.Handler {
	router := http.NewServeMux()

	// Ici toutes les routes
	router.HandleFunc("/", app.Handlers.Home)
	router.HandleFunc("/users", app.Handlers.Users)
	//             -//- -//-

	return app.Middleware.PanicRecover(app.Middleware.LogRequest(router))
}
