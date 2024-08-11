package main

import (
	"net/http"
)

func (app *Application) routes() http.Handler {
	router := http.NewServeMux()

	// Ici toutes les routes
	router.HandleFunc("/", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Home)).ServeHTTP)
	router.HandleFunc("/users", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Users)).ServeHTTP)
	router.HandleFunc("/events", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Events)).ServeHTTP)
	router.HandleFunc("/register", app.Handlers.Register)
	router.HandleFunc("/login", app.Handlers.Login)
	router.HandleFunc("/logout", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.UserLogoutPost)).ServeHTTP)
	router.HandleFunc("/follows", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Follows)).ServeHTTP)
	//             -//- -//-

	return app.Middleware.PanicRecover(app.Middleware.LogRequest(router))
}
