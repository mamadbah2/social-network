import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Group } from "@/models/group.model";
import { Comment } from "@/models/comment.model";

export function mapUser(data: any):User[] {
    if (!data) {
        return []
    }

    return data.map((u: any):User => ({
        id: u.Id,
        email: u.Email,
        firstname: u.FirstName,
        lastname: u.LastName,
        nickname: u.Nickname,
        dateOfBirth: u.DateOfBirth,
        aboutMe: u.AboutMe,
        private: u.Private,
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
        author: mapUser([p.Author])[0],
        group: p.Group ? mapGroup(p.Group) : undefined,          // Handle optional group
        comments: p.Comments ? mapComments(p.Comments) : [],     // Handle optional comments
        viewers: p.Viewers ? mapUser(p.Viewers) : [],            // Handle optional viewers
    }));
}


// Example of mapping for Group and Comments
export function mapGroup(data: any): Group {
    return {
        Id: data.Id,                                   // Changed to camelCase
        Name: data.Name,                               // Changed to camelCase
        Description: data.Description,                 // Changed to camelCase
        Creator: mapUser([data.Creator])[0],           // Assuming mapUser exists and Creator is an object
        CreatedAt: new Date(data.CreatedAt),
    };
}



export function mapComments(data: any): Comment[] {
    return data.map((c: any): Comment => ({
        id: c.Id,
        content: c.Content,
        createdAt: new Date(c.CreatedAt),
        author: c.Author ? mapUser([c.Author])[0] : undefined, // Reuse mapUser
        // Add other fields as necessary
    }));
}
