import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { Group } from "@/models/group.model";
import { Event } from "@/models/event.model";

export function mapSimpleUser(data: any): User {
    if (!data) {
        return {
            Id: 0,
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
        Id: data.Id,
        email: data.Email,
        firstname: data.FirstName,
        lastname: data.LastName,
        nickname: data.Nickname,
        dateOfBirth: data.DateOfBirth,
        aboutMe: data.AboutMe,
        private: data.Private,
        groups: mapGroup(data.Groups),
        createdGroups : mapGroup(data.CreatedGroups),
    }

    // return som
}

export function mapUser(data: any): User[] {
    if (!data) {
        return []
    }

    return data.map((u: any): User => {
        // console.log('u.Groups :>> ', mapGroup(u.Groups));

        return ({
            Id: u.Id,
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
    }));
}

export function mapGroup(data: any): Group[] {
    if (!data) {
        return [];
    }
    
    if (!Array.isArray(data)) {
        return [{
            Id : data.Id,
            Name : data.Name,
            Description : data.Description,
            Creator : data.Creator,
            CreatedAt : data.CreatedAt,
            Posts : mapPost(data.Posts),
            Members : data.Members,
            Events : mapEvent(data.Events),
        }];
    }
    

    return data.map((g: any): Group => ({
        Id : g.Id,
        Name : g.Name,
        Description : g.Description,
        Creator : g.Creator,
        CreatedAt : g.CreatedAt,
        Posts : mapPost(g.Posts),
        Members : g.Members,
        Events : mapEvent(g.Events),
    }));
}

export function mapEvent(data: any): Event[] {
    if (!data) {
        return [];
    }

    return data.map((e: any): Event => ({
        id : e.Id,
        title : e.Tittle,
        description : e.Description,
        date  : e.Date,
        creator: e.Creator,
        group : e.Group,
    }));
}

