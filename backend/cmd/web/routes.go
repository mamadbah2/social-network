package main

import (
	"net/http"
)

func (app *Application) routes() http.Handler {
	router := http.NewServeMux()

	// Ici toutes les routes
	router.HandleFunc("/", app.Handlers.Home)
	router.HandleFunc("/users", app.Handlers.Users)
	router.HandleFunc("/user/register", app.Handlers.UserRegister)
	router.HandleFunc("/user/login", app.Handlers.UserLoginPost)
	router.HandleFunc("/user/logout", app.Handlers.UserLogoutPost)
	router.HandleFunc("/follows", app.Handlers.Follows)
	return app.Middleware.PanicRecover(app.Middleware.LogRequest(router))
}
