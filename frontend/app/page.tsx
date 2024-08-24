'use client'

import Post from "@/components/uiperso/postcompoments";
import SideBarList from "@/components/uiperso/sidebarlist";
import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";

export default function Home() {
  const { data: posts, error, isLoading } = useGetData('/posts', mapPost);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <div className="w-1/4">
        <SideBarList />
      </div>
      
      {/* Posts on the right */}
      <div className="w-3/4 ml-4">
        {posts && posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            date={new Date(post.createdAt).toLocaleDateString()}
            description={post.content}
            imageSrc="https://www.pinterest.com/your_image_link_here.jpg" // Example placeholder
            profilePicture={post.author?.profilePicture || "https://your-backend.com/path/to/default-profile-picture.jpg"}
            likes={post.numberLike.toString()}
            comments={post.numberComment.toString()}
            shares="1.5k"  // Assuming shares might be calculated or static
          />
        ))}
      </div>
    </div>
  );
}
