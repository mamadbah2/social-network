import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { Group } from "@/models/group.model";

export function mapUser(data: any): User[] {
    if (!data) {
        return []
    }

    return data.map((u: any): User => ({
        id: u.Id,
        email: u.Email,
        firstname: u.FirstName,
        lastname: u.LastName,
        nickname: u.Nickname,
        dateOfBirth: u.DateOfBirth,
        aboutMe: u.AboutMe,
        private: u.Private,
        profilePicture: u.ProfilePicture, 
    }))

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


    return data.map((g: any): Group => ({
        Id: g.Id,
        Name : g.Name,
        Description : g.Description,
        Creator: g.Author,
        CreatedAt: g.CreatedAt,
    }));
}
