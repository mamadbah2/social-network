"use client"

import SocialMediaLayout from "@/app/socialMediaLayout";
import CreateGroupForm from "@/components/uiperso/CreateGroupModal";
import GroupBarComponent from "@/components/uiperso/GroupBar";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/SideBarList";
import PostCard from "@/components/uiperso/SocialMediaPost";
import useGetData from "@/lib/hooks/useget";
import usePostData from "@/lib/hooks/usepost";
import { mapPost } from "@/lib/modelmapper";
import { Post } from "@/models/post.model";
import React, { useState } from "react";

export function CreateGroupHandler() {
  
}

export default function Home() {
  const { expect: posts, error: errPosts, isLoading } = useGetData<Post[]>("/groupHomePage", mapPost);
  const [showForm, setShowForm] = useState(false);
  
  const handleSave = async (name: string, description: string) => {
    console.log(name, description);
    
    const formData = new FormData();
    formData.append("GroupName", name);
    formData.append("GroupDescrp", description);
    const [resp, err] = await usePostData('/groups', formData, true)
    console.log(resp, err)
    console.log('group Created');
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (posts.length == 0) {
    return (
      <SocialMediaLayout
        header={<NavigationBar />}
        aside={<SideBarList />}
        section={
          <div className="pl-3 space-y-4">
            <GroupBarComponent
              imgSrc=''
              groupName=''
              createdAt=''
              descriptionLink=''
              creator={false}
              setShowForm={setShowForm}
            />
            {showForm && <CreateGroupForm onSave={handleSave} onCancel={handleCancel} />}
            <div className="space-y-4">
              <p>No posts Rn...</p>
            </div>
          </div>
        }
      />
    );
  }
  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList />}
      section={
        <>
        <div className="pl-3 space-y-4">
          <GroupBarComponent
              imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
              groupName=''
              createdAt=''
              descriptionLink=''
              creator={false}
              setShowForm={setShowForm}
            />
          {posts.map((post) => (
            <PostCard
            key={post.id}
              username={post.author?.nickname || 'loading name failed.'}
              avatarSrc={'post.avatarSrc'}
              date={post.createdAt.toString()}
              title={post.title}
              content={post.content}
              imageSrc={'post.imageSrc'}
              likes={post.numberLike}
              shares={45}
              comments={76}
              />
            ))}
        </div>
        </>
      }
    />
  );
}