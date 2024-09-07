import React, { createContext, useContext, useState, ReactNode } from "react";
import { Post } from "@/models/post.model";
import { Comment } from "@/models/comment.model";

// Interface combinée pour le contexte
interface PostAndCommentContextType {
  postTable: Post[] | null;
  setPostTable: React.Dispatch<React.SetStateAction<Post[] | null>>;
  comment: Comment | null;
  setComment: React.Dispatch<React.SetStateAction<Comment | null>>;
}

const PostContext = createContext<PostAndCommentContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext or useCommentContextType must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [postTable, setPostTable] = useState<Post[] | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);

  return (
    <PostContext.Provider value={{ postTable, setPostTable, comment, setComment }}>
      {children}
    </PostContext.Provider>
  );
};
