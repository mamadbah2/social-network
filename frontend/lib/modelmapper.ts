import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { Group } from "@/models/group.model";
import { Event } from "@/models/event.model";

export function mapSimpleUser(data: any): User {
    if (!data) {
        return {
            id: 0,
            email: "",
            firstname: "",
            lastname: "",
            nickname: " ",
            dateOfBirth: new Date(),
            aboutMe: "",
            private: false,
        }
    }

    return {
        id: data.Id,
        email: data.Email,
        firstname: data.FirstName,
        lastname: data.LastName,
        nickname: data.Nickname,
        dateOfBirth: data.DateOfBirth,
        aboutMe: data.AboutMe,
        private: data.Private,
        groups: mapGroup(data.Groups),
        createdGroups : mapGroup(data.CreatedGroups),
        suggestedFriends : mapUser(data.SuggestedFriends)
    }

    // return som
}

export function mapUser(data: any): User[] {
    if (!data) {
        return []
    }

    if (!Array.isArray(data)) {
        return [{
            id: data.Id,
            email: data.Email,
            firstname: data.FirstName,
            lastname: data.LastName,
            nickname: data.Nickname,
            dateOfBirth: data.DateOfBirth,
            aboutMe: data.AboutMe,
            private: data.Private,
            groups: mapGroup(data.Groups),
            createdGroups : mapGroup(data.CreatedGroups),
            suggestedFriends : mapUser(data.SuggestedFriends)
        }];
    }
    

    return data.map((u: any): User => {
        // console.log('u.Groups :>> ', mapGroup(u.Groups));

        return ({
            id: u.Id,
            email: u.Email,
            firstname: u.FirstName,
            lastname: u.LastName,
            nickname: u.Nickname,
            dateOfBirth: u.DateOfBirth,
            aboutMe: u.AboutMe,
            private: u.Private,
            groups: mapGroup(u.Groups)
        })
    })

    // return som
}

export function mapPost(data: any): Post[] {
    if (!data) {
        return [];
    }
    
    return data.map((p: any): Post => ({
        id: p.Id,
        title: p.Title,
        content: p.Content,
        createdAt: new Date(p.CreatedAt),
        privacy: p.Privacy,
        liked: p.Liked,
        disliked: p.Disliked,
        numberLike: p.NumberLike,
        numberDislike: p.NumberDislike,
        numberComment: p.NumberComment,
        author: mapSimpleUser(p.Author),
        viewers: mapUser(p.Viewers),
    }));
}

export function mapGroup(data: any): Group[] {
    if (!data) {
        return [];
    }
    
    if (!Array.isArray(data)) {
        return [{
            id : data.Id,
            name : data.Name,
            description : data.Description,
            creator : data.Creator,
            createdAt : data.CreatedAt,
            posts : mapPost(data.Posts),
            members : data.Members,
            events : mapEvent(data.Events),
        }];
    }
    

    return data.map((g: any): Group => ({
        id : g.Id,
        name : g.Name,
        description : g.Description,
        creator : g.Creator,
        createdAt : g.CreatedAt,
        posts : mapPost(g.Posts),
        members : g.Members,
        events : mapEvent(g.Events),
    }));
}

export function mapEvent(data: any): Event[] {
    if (!data) {
        return [];
    }

    if (!Array.isArray(data)) {
        return [{
            Id : data.Id,
            Title : data.Title,
            Description : data.Description,
            Date : data.Date,
            Time : data.Time,
            Creator : mapUser(data.Creator)[0],
            Group : mapGroup(data.Group)[0],
        }];
    }

    return data.map((e: any): Event => ({
        Id : e.Id,
        Title : e.Title,
        Description : e.Description,
        Date : e.Date,
        Time : e.Time,
        Creator : mapUser(e.Creator)[0],
        Group : mapGroup(e.Group)[0],
    }));
}

