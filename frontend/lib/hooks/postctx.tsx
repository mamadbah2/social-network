import React, { createContext, useContext, useState, ReactNode } from "react";
import { Post } from "@/models/post.model";

interface PostContextType {
  postTable: Post[] | null;
  setPostTable: React.Dispatch<React.SetStateAction<Post[] | null>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [postTable, setPostTable] = useState<Post[] | null>(null);

  return (
    <PostContext.Provider value={{ postTable, setPostTable }}>
      {children}
    </PostContext.Provider>
  );
};
