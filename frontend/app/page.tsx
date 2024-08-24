'use client'

import NavigationBar from "@/components/uiperso/NavigationBar";
import PostSection from "@/components/uiperso/PostSection";
import SocialMediaLayout from "./socialMediaLayout";
import useGetData from "@/lib/hooks/useget";
import SideBarList from "@/components/uiperso/sidebarlist";
import { mapPost } from "@/lib/modelmapper";

export default function Home() {
  const { data: posts, error, isLoading } = useGetData('/posts', mapPost);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList />}
      section={<PostSection posts={posts} />}
    />
  );
}
