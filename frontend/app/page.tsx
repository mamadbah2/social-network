"use client";

import PostSection from "@/components/uiperso/PostSection";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { expect: posts, error, isLoading } = useGetData("/posts", mapPost);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    router.push("/login");
    return null;
  }

  return <PostSection posts={posts} />;
}
