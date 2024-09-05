"use client";

import ViewPost from "@/components/uiperso/viewPost";
import useGetData from "@/lib/hooks/useGet";
import { mapSimplePost } from "@/lib/modelmapper";

export default function Page({ params }: { params: { id: string } }) {
  const { expect: posts } = useGetData(`/posts?id=${params.id}`, mapSimplePost);

  return posts ? <ViewPost post={posts} /> : null;
}
