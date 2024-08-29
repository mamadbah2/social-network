"use client"

import SocialMediaLayout from "@/app/socialMediaLayout";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/SideBarList";
import PostCard from "@/components/uiperso/SocialMediaPost";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import { Post } from "@/models/post.model";
import React from "react";



export default function Home() {
  const { expect: posts, error: errPosts, isLoading } = useGetData<Post[]>("/groupHomePage", mapPost);
  if (posts.length == 0) {
    return (
      <SocialMediaLayout
        header={<NavigationBar />}
        aside={<SideBarList />}
        section={
          <div className="space-y-4">
            <p>No posts Rn...</p>
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
        <div className="space-y-4">
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
      }
    />
  );
}