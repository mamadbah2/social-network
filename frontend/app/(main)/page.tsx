"use client";
import PostSection from "@/components/uiperso/PostSection";
import { WithAuth } from "@/components/uiperso/PrivateRoute";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import { mapPost } from "@/lib/modelmapper";
import { Post } from "@/models/post.model";
import { useEffect, useState } from "react";

function Home() {
  const { expect: posts } = useGetData("/posts", mapPost);
  const { postTable, setPostTable } = usePostContext();
  const [updatedPost, setUpdatedPost] = useState<Post[] | null>([]);

  // Utilise useEffect pour mettre à jour les états seulement quand posts change
  useEffect(() => {
    if (posts) {
      setPostTable(posts);
      setUpdatedPost(posts);
    }
  }, [posts, setPostTable]);

  useEffect(() => {
    setUpdatedPost(postTable);
  }, [postTable]);

  return <PostSection posts={updatedPost} />;
}

export default WithAuth(Home);
