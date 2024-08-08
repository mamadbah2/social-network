package main

import (
	"net/http"
)

func (app *Application) routes() http.Handler {
	router := http.NewServeMux()

	// Ici toutes les routes
	router.HandleFunc("/", app.Handlers.Home)
	router.HandleFunc("/users", app.Handlers.Users)
	router.HandleFunc("/register", app.Handlers.UserRegister)
	router.HandleFunc("/login", app.Handlers.UserLoginPost)
	router.HandleFunc("/groups", app.Handlers.GroupsHandle)
	//             -//- -//-

	return app.Middleware.PanicRecover(app.Middleware.LogRequest(router))
}
