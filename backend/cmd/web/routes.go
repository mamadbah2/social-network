package main

import (
	"net/http"
)

func (app *Application) routes() http.Handler {
	router := http.NewServeMux()

	// Ici toutes les routes
	router.HandleFunc("/", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Home)).ServeHTTP)
	router.HandleFunc("/users", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Users)).ServeHTTP)
	router.HandleFunc("/register", app.Handlers.UserRegister)
	router.HandleFunc("/login", app.Handlers.UserLoginPost)
	router.HandleFunc("/logout", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.UserLogoutPost)).ServeHTTP)
	router.HandleFunc("/follows", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Follows)).ServeHTTP)
	//             -//- -//-

	return app.Middleware.PanicRecover(app.Middleware.LogRequest(router))
}
