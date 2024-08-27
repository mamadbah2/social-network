'use client'

import NavigationBar from "@/components/uiperso/NavigationBar";
import SocialMediaLayout from "./socialMediaLayout";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import PostSection from "@/components/uiperso/PostSection";
import { useRouter } from "next/navigation";
import SideBarList from "@/components/uiperso/sidebarlist";

export default function Home() {
  const router = useRouter()
  const { expect: posts, error, isLoading } = useGetData('/posts', mapPost);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    router.push('/login')
    return null
  } 

  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList/>}
      section={<PostSection posts={posts}/>}
    />
  );
}
