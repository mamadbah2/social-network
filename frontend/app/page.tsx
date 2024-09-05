"use client";

import PostSection from "@/components/uiperso/PostSection";
import useGetData from "@/lib/hooks/useGet";
import { mapPost } from "@/lib/modelmapper";
import HandAuth from "@/lib/utils";

export default function Home() {
  HandAuth();
  const { expect: posts } = useGetData("/posts", mapPost);

  return <PostSection posts={posts ?? []} />;
}
