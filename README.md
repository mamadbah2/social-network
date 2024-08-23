# social-network

## Table of Contents

- [**Description**](#description)
- [**Tech Stack**](#tech-stack)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
  - [Others](#others)
- [**Installation**](#installation)
  - [Cloning](#cloning)
  - [File System](#file-system)
    - [backend/](#backend)
    - [frontend/](#frontend)
- [**Usage**](#usage)
  - [Next.js](#nextjs)
    - [Getting started](#getting-started)
    - [Learn more](#learn-more)
    - [Deploy on Vercel](#deploy-on-vercel)
  - [Go](#go)
  - [Docker Compose](#docker-compose)
    - [Building and running your application](#building-and-running-your-application)
    - [Deploying your application to the cloud](#deploying-your-application-to-the-cloud)
    - [References](#references)
- [**Blueprints**](#blueprints)
  - [Models](#models)
  - [Register](#register)
  - [Login](#login)
  - [Profile](#profile)
  - [Post](#post)
  - [Comment](#comment)
  - [Reaction](#reaction)
  - [Chat](#chat)
  - [Follow](#follow)
  - [Group](#group)
- [**Aknowlegments**](#aknowlegments)
  - [Contributors](#contributors)
  - [Peers](#peers)
  - [Testers](#testers)
  - [Auditors](#auditors)
- [**Sources**](#sources)
- [**License**](#license)

## Description

###### [_Table of Content ⤴️_](#table-of-contents)

## Tech Stack

### Front-End

Click on badges to get to the code...

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JAVASCRIPT](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)]()
[![TYPESCRIPT](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()  
[![TAILWINDCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
[![REACT](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![NEXT.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
[![DOCKER](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)]()

### Back-End

Click on badges to get to the code...

[![GO](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)]()
[![SQLITE](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)]()
[![DOCKER](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)]()

### Development

[![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)]()
[![SHELL SCRIPT](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)]()
[![GITHUB](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)]()

### Office

[![TRELLO](https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white)]()
[![FIGMA](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)]()
[![WARP](https://img.shields.io/badge/warp-01A4FF?style=for-the-badge&logo=warp&logoColor=white)]()

### Others

[![MARKDOWN](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)](#table-of-contents)

###### [_Table of Content ⤴️_](#table-of-contents)

## Installation

### Cloning

```shell
git clone http://learn.zone01dakar.sn/git/jefaye/social-network.git
cd social-network
```

### File System

    |
    + -- backend/
    |
    + -- frontend/
    |
    + -- .dockerignore
    + -- .gitignore
    + -- audit.todo
    + -- docker-compose.yml
    + -- gitify.sh
    + -- LICENSE
    + -- Makefile
    + -- README.md

#### backend/

    |
    + --- cmd/
    |       |
    |       + --- web/
    |               |
    |               + -- handlers/
    |               |       + -- config.handler.go
    |               |       + -- home.handler.go
    |               |       + -- login.handler.go
    |               |       + -- register.handler.go
    |               |       + -- user.handler.go
    |               |
    |               + -- helpers/
    |               |       + -- client.helper.go
    |               |       + -- config.helper.go
    |               |       + -- server.helper.go
    |               |
    |               + -- middleware/
    |               |       + -- config.middleware.go
    |               |       + -- log.middleware.go
    |               |       + -- panic.middleware.go
    |               |
    |               + -- validators/
    |               |       + -- config.validator.go
    |               |       + -- user.validator.go
    |               |
    |               + -- main.go
    |               + -- routes.go
    |
    + -- database/
    |       |
    |       + -- data/
    |       |       + -- follows.data.sql
    |       |       + -- groups.data.sql
    |       |       + -- posts.data.sql
    |       |       + -- users.data.sql
    |       |
    |       + -- migrations/
    |       |       |
    |       |       + -- sqlite/
    |       |               + -- 000001_create_users_table.down.sql
    |       |               + -- 000001_create_users_table.up.sql
    |       |               + -- 000002_create_posts_table.down.sql
    |       |               + -- 000002_create_posts_table.up.sql
    |       |               + -- 000003_create_comments_table.down.sql
    |       |               + -- 000003_create_comments_table.up.sql
    |       |               + -- 000005_create_messages_table.down.sql
    |       |               + -- 000005_create_messages_table.up.sql
    |       |               + -- 000006_create_post_visibility_table.down.sql
    |       |               + -- 000006_create_post_visibility_table.up.sql
    |       |               + -- 000007_create_reactions_table.down.sql
    |       |               + -- 000007_create_reactions_table.up.sql
    |       |               + -- 000008_create_groups_table.down.sql
    |       |               + -- 000008_create_groups_table.up.sql
    |       |               + -- 000009_create_groups_members_table.up.sql
    |       |               + -- 000010_create_follows_table.down.sql
    |       |               + -- 000010_create_follows_table.up.sql
    |       |               + -- 000011_create_events_table.down.sql
    |       |               + -- 000011_create_events_table.up.sql
    |       |
    |       + -- social-network.db
    |
    + -- internal/
    |       |
    |       + -- models/
    |       |       + -- comment.model.go
    |       |       + -- config.model.go
    |       |       + -- event.model.go
    |       |       + -- follow.model.go
    |       |       + -- group.model.go
    |       |       + -- message.model.go
    |       |       + -- post.model.go
    |       |       + -- reaction.model.go
    |       |       + -- user.model.go
    |       |
    |       + -- utils/
    |               + -- db.manager.go
    |
    + -- backend.Dockerfile
    + -- go.mod
    + -- go.sum

#### frontend/

    |
    + --- app/
    |       |
    |       + -- login/
    |       |       |
    |       |       + -- page.tsx
    |       |
    |       + -- register/
    |       |       |
    |       |       + -- page.tsx
    |       |
    |       + -- favicon.ico
    |       + -- global.css
    |       + -- layout.tsx
    |       + -- page.tsx
    |       + -- securelayout.tsx
    |
    + -- components/
    |       |
    |       + --- ui/
    |               + -- button.tsx
    |               + -- checkbox.tsx
    |               + -- checker.tsx
    |               + -- input.tsx
    |               + -- textarea.tsx
    |
    + --- lib/
    |       |
    |       + -- hooks/
    |       |       + -- useget.ts
    |       |       + -- usepost.ts
    |       |
    |       + -- cookie.ts
    |       + -- utils.ts
    |
    + -- public/
    |       |
    |       + -- upload/
    |       |       + -- ...
    |       |
    |       + -- next.svg
    |       + -- vercel.svg
    |
    + -- .eslintrc.json
    + -- .gitignore
    + -- components.json
    + -- frontend.Dockerfile
    + -- next.config.mjs
    + -- package-lock.json
    + -- package.json
    + -- postcss.config.mjs
    + -- tailwind.config.ts
    + -- tsconfig.json

###### [_Table of Content ⤴️_](#table-of-contents)

## Usage

### Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

#### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

#### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

#### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Go

```shell
cd backend
go run ./cmd/web/.
INFO	16:54:48.394607 server on http://localhost:4000
```

### Docker Compose

#### Building and running your application

When you're ready, start your application by running:

```shell
docker compose up --build
```

Your application will be available at http://localhost:3000.

#### Deploying your application to the cloud

First, build your image, e.g.:

```shell
docker build -t myapp .
```

If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:

```shell
docker build --platform=linux/amd64 -t myapp .
```

Then, push it to your registry, e.g.

```shell
docker push myregistry.com/myapp
```

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

#### References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)

###### [_Table of Content ⤴️_](#table-of-contents)

## Blueprints

### Models

```mermaid
classDiagram
    class User {
        ~ id: int
        - email: String
        # password: String
        - first_name: String
        - last_name: String
        - date_of_birth: Time
        - profile_picture: String
        - nickname: String
        - about_me: String
        - profile_privacy: Boolean
        - created_at: Time
        + Set(): void
        + Follow(user): void
        + Unfollow(user): void
        + IsFollowing(user): Boolean
        + IsFollowedBy(user): Boolean
    }

    class Post {
        ~ id: int
        - id_author: int
        - id_group: int
        - title: String
        - content: String
        - privacy: String
        - created_at: Time
        + Set(): void
    }

    class Comment {
        ~ id: int
        - id_author: int
        - id_post: int
        - content: String
        - created_at: Time
        + Set(): void
    }

    class Reaction {
        ~ id: int
        - id_user: int
        - id_post: int
        - id_comment: int
        - like: Boolean
        - dislike: Boolean
        + Set(): void
    }

    class Group {
        ~ id: int
        - id_creator: int
        - name: String
        - description: String
        - created_at: Time
        + Set(): void
    }

    class Event {
        ~ id: int
        - id_creator: int
        - id_group: int
        - title: String
        - description: String
        - event_date: Time
        + Set(): void
    }

    class Message {
        ~ id: int
        - id_sender: int
        - id_receiver: int
        - content: String
        - message_type: String
        - created_at: Time
        + Set(): void
    }

    User "0..*" -- "0..*" User: Follows
    User "1" -- "0..*" Post: Publishes
    User "1" -- "0..*" Comment: Writes
    Comment "0..*" ..> "1" Post: on
    User "1" -- "0..*" Reaction: Sends
    Reaction "0..*" ..> "1" Post: on
    Post "0..*" --o "1" Group: in

    User "1" -- "0..*" Group: Creates
    User "0..*" --o "0..*" Group: Joins
    User "1" -- "0..*" Event: Creates
    Event "0..*" ..> "1" Group: in

    User "1" -- "0..*" Message: Sends
    User "1..*" -- "0..*" Message: Receives
    Message "0..*" --o "1" Group: in
```

<hr style="background: #111">

### Register

```mermaid
sequenceDiagram
    Participant User
    Participant Client
    Participant Server
    Participant Database

    User ->> User: FILL Form
    User ->> Client: SUBMIT Form
    Client ->> Client: CHECK Inputs Format
    Client ->> Server: POST Form Values
    Server ->> Server: CHECK Request Method
    Server ->> Server: GET Form Values
    Server ->> Server: CHECK Values Format
    Server ->> Database: INSERT INTO users
    Database -->> Server: ADDED
    Server -->> Client: Redirect to Login
    Client -->> User: Login Form
```

<hr style="background: #111">

### Login

```mermaid
sequenceDiagram
    Participant User
    Participant Client
    Participant Server
    Participant Database

    User ->> User: FILL Form
    User ->> Client: SUBMIT Form
    Client ->> Client: CHECK Inputs Format
    Client ->> Server: POST Form Values
    Server ->> Server: CHECK Request Method
    Server ->> Server: GET Form Values
    Server ->> Server: CHECK Values Format
    Server ->> Database: SELECT * FROM users
    Database -->> Server: ROW: User
    Server ->> Server: CHECK Password
    Server -->> Client: Session
    Client -->> User: Home
```

<hr style="background: #111">

### Profile

<hr style="background: #111">

### Post

<hr style="background: #111">

### Comment

<hr style="background: #111">

### Reaction

<hr style="background: #111">

### Chat

```mermaid
sequenceDiagram
    Participant Sender
    Participant Server
    Participant Database
    Participant Receiver

    Sender ->> Server: r == HTTP Request { Upgrade: websocket }
    Server ->> Server: ConnDb.GetSession(r) ---> id_sender
    Server ->> Server: r.URL.Query().Get("id") ---> id_receiver
    Server ->> Server: upgrader.Upgrade(w, r, nil) ---> conn_sender
    Server -->> Sender: HTTP Response(101 Switching Protocols)
    Sender ->> Sender: socket.onopen
    Server ->> Server: chatbox[id_sender] = conn_sender

    Server ->> Database: ConnDB.Get(...)
    Database ->> Database: SELECT * FROM messages...
    Database -->> Server: old_messages <--- *sql.Rows
    Server ->> Sender: conn_sender.WriteJSON(old_messages)

    loop Sending...
        Note left of Sender: INPUT
        Sender ->> Sender: button.onclick
        Sender ->> Server: socket.send() ---> new_message
        Server ->> Server: conn_sender.ReadJSON(&new_message)
        Server ->> Database: ConnDB.Set(new_message)
        Database ->> Database: INSERT INTO messages...
        Database -->> Server: sql.Result
        Server ->> Server: chatbox[id_receiver] exists ?
        opt true
            Server ->> Receiver: conn_receiver.WriteJSON(new_message)
            Receiver ->> Receiver: socket.onmessage
            Note right of Receiver: OUPTPUT
        end
    end
```

<hr style="background: #111">

### Follow

<hr style="background: #111">

### Group

###### [_Table of Content ⤴️_](#table-of-contents)

## Aknowlegments

### Contributors

[![muciss](https://img.shields.io/badge/Zone01-muciss-yellow)](http://learn.zone01dakar.sn/git/muciss)
[![cnzale](https://img.shields.io/badge/Zone01-cnzale-yellow)](http://learn.zone01dakar.sn/git/cnzale)
[![mamadbah2](https://img.shields.io/badge/Zone01-mamadbah2-yellow)](http://learn.zone01dakar.sn/git/mamadbah2)
[![belhadjs](https://img.shields.io/badge/Zone01-belhadjs-yellow)](http://learn.zone01dakar.sn/git/belhadjs)
[![adiane](https://img.shields.io/badge/Zone01-adiane-yellow)](http://learn.zone01dakar.sn/git/adiane)
[![jefaye](https://img.shields.io/badge/Zone01-jefaye-yellow)](http://learn.zone01dakar.sn/git/jefaye)

### Peers

[![](https://img.shields.io/badge/Zone01-blue)](http://learn.zone01dakar.sn/git/)

### Testers

[![mandaw](https://img.shields.io/badge/Zone01-mandaw-red)](http://learn.zone01dakar.sn/git/mandaw)
[![bindoye](https://img.shields.io/badge/Zone01-bindoye-red)](http://learn.zone01dakar.sn/git/bindoye)

### Auditors

[![](https://img.shields.io/badge/Zone01-green)](http://learn.zone01dakar.sn/git/)
[![](https://img.shields.io/badge/Zone01-green)](http://learn.zone01dakar.sn/git/)
[![](https://img.shields.io/badge/Zone01-green)](http://learn.zone01dakar.sn/git/)
[![](https://img.shields.io/badge/Zone01-green)](http://learn.zone01dakar.sn/git/)
[![](https://img.shields.io/badge/Zone01-green)](http://learn.zone01dakar.sn/git/)

###### [_Table of Content ⤴️_](#table-of-contents)

## Sources

###### [_Table of Content ⤴️_](#table-of-contents)

## License
