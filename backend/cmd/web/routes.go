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
	router.HandleFunc("/session", app.Handlers.Session)
	router.HandleFunc("/chat", app.Handlers.Chat)
	router.HandleFunc("/logout", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.UserLogoutPost)).ServeHTTP)
	router.HandleFunc("/comment", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.ComsHandle)).ServeHTTP)
	router.HandleFunc("/follow", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Follows)).ServeHTTP)
	router.HandleFunc("/posts", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Post)).ServeHTTP)
	router.HandleFunc("/groups", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.GroupsHandle)).ServeHTTP)
	router.HandleFunc("/notification", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Notification)).ServeHTTP)
	router.HandleFunc("/notif", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Notif)).ServeHTTP)
	router.HandleFunc("/reaction", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Reactions)).ServeHTTP)
	// router.HandleFunc("/chat", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.Chat)).ServeHTTP)
	router.HandleFunc("/like", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.LikeReaction)).ServeHTTP)
	router.HandleFunc("/dislike", app.Middleware.Authenticate(http.HandlerFunc(app.Handlers.DislikeReaction)).ServeHTTP)
	router.HandleFunc("/groupMembers", app.Handlers.GroupMembersHandle)
	router.HandleFunc("/groupHomePage", app.Handlers.GroupHomePageHandle)
	//             -//- -//-

	return app.Middleware.PanicRecover(app.Middleware.LogRequest(app.Middleware.CORS(router)))
}
