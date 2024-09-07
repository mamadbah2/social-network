"use client";
import { Post } from "@/models/post.model"; // Adjust path if necessary
import React, { useEffect } from "react";
import PostCard from "./PostCard";
import ViewComment from "./viewComment";
import { usePostContext } from "@/lib/hooks/postctx";
import { Comment } from "@/models/comment.model";

interface PostSectionProps {
  post: Post; // Ensure this matches the Post type
}

const ViewPost: React.FC<PostSectionProps> = ({ post }) => {
  const {comment} = usePostContext();
  const [commentTable, setCommentTable] = React.useState<Comment[]| null>(post.comments as Comment[]);

  useEffect(() => {
    if (comment) {
      setCommentTable((prev)=>[comment as Comment, ...(prev as Comment[]) ]);
      post.numberComment = post.numberComment + 1;
    } 
  },[comment]);
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
      <ViewComment comments={(commentTable)?.reverse()} />
    </div>
  );
};

export default ViewPost;
