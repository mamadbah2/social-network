import { User } from "@/models/user.model";

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