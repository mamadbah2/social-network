'use client'

import NavigationBar from "@/components/uiperso/NavigationBar";
import SocialMediaLayout from "./socialMediaLayout";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import PostSection from "@/components/uiperso/PostSection";
import { redirect } from "next/navigation";
import SideBarList from "@/components/uiperso/sidebarlist";
import { useEffect } from "react";

export default function Home() {
  const { expect: posts, error, isLoading } = useGetData('/posts', mapPost);
  console.log('error :>> ', error);
  if (isLoading) return <p>Loading...</p>;
  if (posts.length === 0) redirect('/login');
  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList/>}
      section={<PostSection posts={posts}/>}
    />
  );
}
