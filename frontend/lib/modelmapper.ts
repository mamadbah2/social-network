import { Comment } from "@/models/comment.model";
import { Event } from "@/models/event.model";
import { Group } from "@/models/group.model";
import { Msg } from "@/models/message.model";
import { Notification } from "@/models/notification.model";
import { Post } from "@/models/post.model";
import { Reaction } from "@/models/reaction.model";
import { Session } from "@/models/session.model";
import { User } from "@/models/user.model";

export function mapSimpleUser(data: any): User {
  if (!data) {
    return {
      id: 0,
      email: "",
      firstname: "",
      lastname: "",
      nickname: "",
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
      imageSrc: p.ImageSrc || undefined, // Handle optional imageSrc field
      author: p.Author ? mapSimpleUser(p.Author) : undefined, // Optional field for the author
      group: p.Group ? mapGroup(p.Group)[0] : undefined, // Optional field for the group
      comments: p.Comments ? p.Comments : undefined, // Optional array of comments
      viewers: p.Viewers ? mapUser(p.Viewers) : undefined, // Optional array of viewers
    })
  );
}

export function mapGroup(data: any): Group[] {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    return [
      {
        id: data.Id,
        name: data.Name,
        description: data.Description,
        creator: mapSimpleUser(data.Creator),
        createdAt: data.CreatedAt,
        posts: mapPost(data.Posts) || [],
        members: mapUser(data.Members),
        events: mapEvent(data.Events) || [],
      },
    ];
  }

  return data.map(
    (g: any): Group => ({
      id: g.Id,
      name: g.Name,
      description: g.Description,
      creator: mapSimpleUser(g.Creator),
      createdAt: g.CreatedAt,
      posts: mapPost(g.Posts) || [],
      members: mapUser(g.Members),
      events: mapEvent(g.Events) || [],
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

export function mapEvent(data: any): Event[] {
  if (!data) {
    return [];
  }

  if (!Array.isArray(data)) {
    return [
      {
        Id: data.Id,
        Title: data.Title,
        Description: data.Description,
        Date: data.Date,
        Time: data.Time,
        Liked: data.Liked,
        Disliked: data.Disliked,
        NumberLike: data.NumberLike,
        NumberDislike: data.NumberDislike,
        Creator: mapSimpleUser(data.Creator),
        Group: mapGroup(data.Group)[0],
      },
    ];
  }

  return data.map(
    (e: any): Event => ({
      Id: e.Id,
      Title: e.Title,
      Description: e.Description,
      Date: e.Date,
      Time: e.Time,
      Liked: e.Liked,
      Disliked: e.Disliked,
      NumberLike: e.NumberLike,
      NumberDislike: e.NumberDislike,
      Creator: mapSimpleUser(e.Creator),
      Group: mapGroup(e.Group)[0],
    })
  );
}

export function mapComments(data: any): Comment[] {
  if (!data) {
    return [];
  }

  return data.map(
    (c: any): Comment => ({
      id: c.Id,
      content: c.Content,
      image: c.ImageName,
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

export function mapSimpleComments(data: any): Comment {
  if (!data) {
    return {
      id: 0,
      content: "",
      image: "",
      author: undefined,
      createdAt: new Date(),
      liked: false,
      disliked: false,
      numberLike: 0,
      numberDislike: 0,
      post: undefined,
    };
  }

  return {
    id: data.Id,
    content: data.Content,
    image: data.ImageName,
    author: mapSimpleUser(data.Author),
    createdAt: new Date(data.Date),
    liked: data.Liked,
    disliked: data.Disliked,
    numberLike: data.NumberLike,
    numberDislike: data.NumberDislike,
    post: mapSimplePost(data.Post),
  };
}

export function mapReactionType(data: any): Reaction {
  if (!data) {
    return {
      liked: false,
      disliked: false,
    };
  }

  return {
    liked: data.Liked,
    disliked: data.Disliked,
  };
}

export function mapMessage(data: any): Msg[] {
  console.log("data :>> ", data);
  if (!data) {
    return [];
  }

  return data.map((u: any): Msg => {
    return {
      id: u.ID,
      content: u.Content,
      type: u.Type,
      sentAt: u.SentAt,
      sender: mapSimpleUser(u.Sender),
      receiver: mapSimpleUser(u.Receiver),
    };
  });
  // return som
}
