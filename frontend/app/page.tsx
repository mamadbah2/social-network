'use client'
<<<<<<< HEAD
import SideBarList from "@/components/uiperso/sidebarlist";

export default function Home() {

  // const {data} = useGetData('/posts')
  

  return <div>
    <SideBarList />
    </div>
}
=======

import React from "react";
import Post from "@/components/uiperso/postcompoments"
import useGetData from "@/lib/hooks/useget"


const Home = () => {
  const { data} = useGetData('http://localhost:4000/posts"')

  console.log(data);
  return (
    <div>
      <Post
        title="Cherif"
        date="01/03/2024"
        description="Create stunning AI videos for free with Haiper AI. Just upload an image or type a text prompt to effortlessly create hi-def videos for social media, your latest ad campaign, or storyboarding. Sign-up for free today!"
        imageSrc="https://www.pinterest.com/your_image_link_here.jpg"
        profilePicture="https://your-backend.com/path/to/profile-picture.jpg"  // Profile picture from backend
        likes="1.5k"
        comments="100"
        shares="1.5k"
      />
    </div>
  );
};

export default Home;
>>>>>>> 131b734914d860342830de5b6773b3bbd9f5cadb
