"use client";
import { Post } from "@/models/post.model"; // Adjust path if necessary
import React from "react";
import PostCard from "./PostCard";
import ViewComment from "./viewComment";

interface PostSectionProps {
  post: Post; // Ensure this matches the Post type
}

const ViewPost: React.FC<PostSectionProps> = ({ post }) => {
  return (
    <div className="space-y-4">
      <PostCard
        key={post.id}
        author={post.author?.id}
        postId={post.id}
        username={post.author?.nickname || "Unknown User"}
        firstname={post.author?.firstname || "Unknown User"}
        lastname={post.author?.lastname || "Unknown User"}
        avatarSrc={post.author?.profilePicture || "/avatar2.jpg"}
        date={
          post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "Unknown Date"
        }
        title={post.title || "Untitled Post"}
        content={post.content || "No content available"}
        imageSrc={post.imageName || ""}
        likes={post.numberLike || 0}
        dislikes={post.numberDislike || 0}
        comments={post.numberComment || 0}
      />
      <ViewComment comments={post.comments} />
    </div>
  );
};

export default ViewPost;
