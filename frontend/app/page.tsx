'use client'
import Post from "@/components/uiperso/postCompoment";
import SideBarList from "@/components/uiperso/sidebarlist";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";



  

export default function Home() {

  // const {data} = useGetData('/posts')
  

    const dataPost = useGetData('/posts', mapPost)
    console.log("datajs", dataPost);
  return <div>
    <SideBarList />
    </div>
}
