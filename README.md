# social-network
You will have a Facebook-like social network

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
    - [Running](#running)
- [**Usage**](#usage)
    - [Register](#register)
    - [Login](#login)
    - [Profile](#profile)
    - [Post](#post)
    - [Comment](#comment)
    - [Reaction](#reaction)
    - [Message](#message)
    - [Follow](#follow)
    - [Group](#group)
- [**Aknowlegments**](#aknowlegments)
    - [Authors](#authors)
    - [Peers](#peers)
    - [Testers](#testers)
    - [Auditors](#auditors)
- [**Sources**](#sources)
- [**License**](#license)

<hr style="background: #333">

## Description

###### [*Table of Content ⤴️*](#table-of-contents)

## Tech Stack

### Front-End

Click on badges to get to the code...

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JAVASCRIPT](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)]()
[![NEXT.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
[![REACT](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()

### Back-End

Click on badges to get to the code...

[![GO](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)]()
[![SQLITE](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)]()

### Others

[![SHELL SCRIPT](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)]()
[![WARP](https://img.shields.io/badge/warp-01A4FF?style=for-the-badge&logo=warp&logoColor=white)]()
[![MARKDOWN](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)](#table-of-contents)  
[![GITHUB](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)]()
[![TRELLO](https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white)]()
[![MAC OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white)]()

###### [*Table of Content ⤴️*](#table-of-contents)

<hr style="background: #333">

## Installation

### Cloning

```shell
git clone http://learn.zone01dakar.sn/git/jefaye/social-network.git
cd social-network
```

### File System

    |
    + -- backend/
    |       |
    |       + --- cmd/
    |       |       |
    |       |       + --- web/
    |       |               |
    |       |               + -- handlers/
    |       |               |
    |       |               + -- helpers/
    |       |               |
    |       |               + -- middleware/
    |       |               |
    |       |               + -- validators/
    |       |
    |       |
    |       + -- database/
    |       |       |
    |       |       + -- datas/
    |       |       |
    |       |       + -- migrations/
    |       |
    |       |
    |       + -- internal/
    |               |
    |               + -- models/
    |               |
    |               + -- utils/
    |
    |
    + -- frontend/
    |       |
    |       + -- static/
    |               |
    |               + -- upload/
    |
    |
    + -- Makefile
    |
    + -- README.md


#### backend/

    |
    + --- cmd/
    |       |
    |       + --- web/
    |               |
    |               + -- handlers/
    |               |       |
    |               |       + -- config.handler.go
    |               |       |
    |               |       + -- home.handler.go
    |               |       |
    |               |       + -- login.handler.go
    |               |       |
    |               |       + -- register.handler.go
    |               |       |
    |               |       + -- user.handler.go
    |               |
    |               |
    |               + -- helpers/
    |               |       |
    |               |       + -- client.helper.go
    |               |       |
    |               |       + -- config.helper.go
    |               |       |
    |               |       + -- server.helper.go
    |               |
    |               |
    |               + -- middleware/
    |               |       |
    |               |       + -- config.middleware.go
    |               |       |
    |               |       + -- log.middleware.go
    |               |       |
    |               |       + -- panic.middleware.go
    |               |
    |               |
    |               + -- validators/
    |               |       |
    |               |       + -- config.validator.go
    |               |       |
    |               |       + -- user.validator.go
    |               |
    |               |
    |               + -- main.go
    |               |
    |               + -- routes.go
    |
    |
    + -- database/
    |       |
    |       + -- datas/
    |       |       |
    |       |       + -- follows.data.sql
    |       |       |
    |       |       + -- groups.data.sql
    |       |       |
    |       |       + -- posts.data.sql
    |       |       |
    |       |       + -- users.data.sql
    |       |
    |       |
    |       + -- migrations/
    |       |       |
    |       |       + -- sqlite/
    |       |               |
    |       |               + -- 000001_create_users_table.down.sql
    |       |               |
    |       |               + -- 000001_create_users_table.up.sql
    |       |               |
    |       |               + -- 000002_create_posts_table.down.sql
    |       |               |
    |       |               + -- 000002_create_posts_table.up.sql
    |       |               |
    |       |               + -- 000003_create_comments_table.down.sql
    |       |               |
    |       |               + -- 000003_create_comments_table.up.sql
    |       |               |
    |       |               + -- 000005_create_messages_table.down.sql
    |       |               |
    |       |               + -- 000005_create_messages_table.up.sql
    |       |               |
    |       |               + -- 000006_create_post_visibility_table.down.sql
    |       |               |
    |       |               + -- 000006_create_post_visibility_table.up.sql
    |       |               |
    |       |               + -- 000007_create_reactions_table.down.sql
    |       |               |
    |       |               + -- 000007_create_reactions_table.up.sql
    |       |               |
    |       |               + -- 000008_create_groups_table.down.sql
    |       |               |
    |       |               + -- 000008_create_groups_table.up.sql
    |       |               |
    |       |               + -- 000009_create_groups_members_table.down.sql
    |       |               |
    |       |               + -- 000009_create_groups_members_table.up.sql
    |       |               |
    |       |               + -- 000010_create_follows_table.down.sql
    |       |               |
    |       |               + -- 000010_create_follows_table.up.sql
    |       |               |
    |       |               + -- 000011_create_events_table.down.sql
    |       |               |
    |       |               + -- 000011_create_events_table.up.sql
    |       |
    |       |
    |       + -- social-network.db
    |
    |
    + -- internal/
    |       |
    |       + -- models/
    |       |       |
    |       |       + -- comment.model.go
    |       |       |
    |       |       + -- config.model.go
    |       |       |
    |       |       + -- event.model.go
    |       |       |
    |       |       + -- follow.model.go
    |       |       |
    |       |       + -- group.model.go
    |       |       |
    |       |       + -- message.model.go
    |       |       |
    |       |       + -- post.model.go
    |       |       |
    |       |       + -- reaction.model.go
    |       |       |
    |       |       + -- user.model.go
    |       |
    |       |
    |       + -- utils/
    |               |
    |               + -- db.manager.go
    |
    |
    + -- go.mod
    |
    + -- go.sum
    

#### frontend/

    |
    + -- static/
            |
            + -- upload/
                    |
                    + -- ...

### Running

```shell
go run .
```

###### [*Table of Content ⤴️*](#table-of-contents)

<hr style="background: #333">

## Usage

### Register

### Login

### Profile

### Post

### Comment

### Reaction

### Message

### Follow

### Group

###### [*Table of Content ⤴️*](#table-of-contents)

<hr style="background: #333">

## Aknowlegments

### Authors

### Peers

### Testers

### Auditors

###### [*Table of Content ⤴️*](#table-of-contents)

<hr style="background: #333">

## Sources

###### [*Table of Content ⤴️*](#table-of-contents)

<hr style="background: #333">

## License