import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { Group } from "@/models/group.model";

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


    return data.map((g: any): Group => ({
        id: g.Id,
        name: g.Name,
        description: g.Description,
        createdAt: g.CreatedAt,
    }));
}
