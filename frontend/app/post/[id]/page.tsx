"use client";

import ViewPost from "@/components/uiperso/viewPost";
import useGetData from "@/lib/hooks/useget";
import { mapSimplePost } from "@/lib/modelmapper";
import handAuth from "@/lib/utils";

export default function Page({ params }: { params: { id: string } }) {
  handAuth();
  const { expect: posts } = useGetData(`/posts?id=${params.id}`, mapSimplePost);

  return <ViewPost post={posts} />;
}
