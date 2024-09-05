import { Comment } from "@/models/comment.model";
import { Group } from "@/models/group.model";
import { Notification } from "@/models/notification.model";
import { Post } from "@/models/post.model";
import { Session } from "@/models/session.model";
import { User } from "@/models/user.model";

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
      profilePicture: "",
    };
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
    createdGroups: mapGroup(data.CreatedGroups),
    posts: mapPost(data.Posts),
    followers: mapUser(data.Followers),
    followed: mapUser(data.Followed),
    profilePicture: data.ProfilePicture,
    suggestedFriends: mapUser(data.SuggestedFriends),
  };

  // return som
}

export function mapUser(data: any): User[] {
  if (!data) {
    return [];
  }

  return data.map((u: any): User => {
    return {
      id: u.Id,
      email: u.Email,
      firstname: u.FirstName,
      lastname: u.LastName,
      nickname: u.Nickname,
      dateOfBirth: u.DateOfBirth,
      aboutMe: u.AboutMe,
      private: u.Private,
      groups: mapGroup(u.Groups),
      profilePicture: u.ProfilePicture,
    };
  });
  // return som
}

export function mapSimplePost(data: any): Post {
  if (!data) {
    return {
      id: 0,
      title: "",
      content: "",
      createdAt: new Date(),
      privacy: "",
      imageName: "",
      liked: false,
      disliked: false,
      numberLike: 0,
      numberDislike: 0,
      numberComment: 0,
    };
  }
  return {
    id: data.Id,
    title: data.Title,
    content: data.Content,
    createdAt: new Date(data.CreatedAt),
    privacy: data.Privacy,
    imageName: data.ImageName,
    liked: data.Liked,
    disliked: data.Disliked,
    numberLike: data.NumberLike,
    numberDislike: data.NumberDislike,
    numberComment: data.NumberComment,
    author: mapSimpleUser(data.Author),
    viewers: mapUser(data.Viewers),
    comments: mapComments(data.Comments),
  };
}

export function mapPost(data: any): Post[] {
  if (!data) {
    return [];
  }

  return data.map(
    (p: any): Post => ({
      id: p.Id,
      title: p.Title,
      content: p.Content,
      createdAt: new Date(p.CreatedAt),
      privacy: p.Privacy,
      imageName: p.ImageName,
      liked: p.Liked,
      disliked: p.Disliked,
      numberLike: p.NumberLike,
      numberDislike: p.NumberDislike,
      numberComment: p.NumberComment,
      author: mapSimpleUser(p.Author),
      viewers: mapUser(p.Viewers),
    })
  );
}

export function mapGroup(data: any): Group[] {
  if (!data) {
    return [];
  }

  return data.map(
    (g: any): Group => ({
      id: g.Id,
      name: g.Name,
      description: g.Description,
      createdAt: g.CreatedAt,
    })
  );
}

export function mapNotification(data: any): Notification[] {
  if (!data) {
    return [];
  }

  data = !Array.isArray(data) ? [data] : data;

  return data.map(
    (n: any): Notification => ({
      id: n.Id,
      content: n.Content,
      approuved: n.Approuved,
      createdAt: n.CreatedAt,
      entityType: n.EntityType,
      entityId: n.EntityID,
      sender: mapSimpleUser(n.Sender),
      receiver: mapSimpleUser(n.Receiver),
    })
  );
}

export function mapSimpleSession(data: any): Session {
  if (!data) {
    return {
      id: 0,
      userId: 0,
    };
  }

  return {
    id: data.Id,
    userId: data.UserId,
  };
}

export function mapComments(data: any): Comment[] {
  if (!data) {
    return [];
  }

  return data.map(
    (c: any): Comment => ({
      id: c.Id,
      content: c.Content,
      author: mapSimpleUser(c.Author),
      createdAt: new Date(c.Date),
      liked: c.Liked,
      disliked: c.Disliked,
      numberLike: c.NumberLike,
      numberDislike: c.NumberDislike,
      post: mapSimplePost(c.Post),
    })
  );
}
