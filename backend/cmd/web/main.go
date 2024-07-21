package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"social-network/cmd/web/handlers"
	"social-network/cmd/web/helpers"
	"social-network/cmd/web/middleware"
	"social-network/internal/models"
	"social-network/internal/utils"

	_ "github.com/mattn/go-sqlite3"
)

type Application struct {
	ConnDB     *models.ConnDB
	Middleware *middleware.Middleware
	Handlers   *handlers.Handler
}

func main() {
	// Prise du flag du port ex: go run ./cmd/web/. -addr=":5000"
	PORT := flag.String("addr", ":4000", "enter port")
	flag.Parse()

	// Initialisation du format des helpers de bases
	help := &helpers.Helpers{
		InfoLog:  log.New(os.Stdout, "INFO\t", log.Ltime|log.Lmicroseconds),
		ErrorLog: log.New(os.Stderr, "ERROR\t", log.Ltime|log.Lmicroseconds|log.Lshortfile),
	}

	// Ouverture de la base de donnee
	db, err := utils.OpenDB("./database/social.network.db")
	if err != nil {
		help.ErrorLog.Fatalln("Open DB error\t", err.Error())
		return
	}

	// On appelle ça dans le jargon injection des dépendances si j'ne m'abuse biensur

	app := &Application{
		ConnDB: &models.ConnDB{DB: db},
		Middleware: &middleware.Middleware{
			Helpers: help,
		},
		Handlers: &handlers.Handler{
			Helpers: help,
		},
	}

	srv := &http.Server{
		Addr:     "localhost" + *PORT,
		Handler:  app.routes(),
		ErrorLog: help.ErrorLog,
	}

	// Lancement du serveur
	help.InfoLog.Printf("server on http://localhost%s", *PORT)
	err = srv.ListenAndServe()
	help.ErrorLog.Fatalln(err.Error())
}
