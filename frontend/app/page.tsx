"use client";

import PostSection from "@/components/uiperso/PostSection";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import handAuth from "@/lib/utils";

export default function Home() {
  handAuth();
  const { expect: posts } = useGetData("/posts", mapPost);

  return <PostSection posts={posts} />;
}
