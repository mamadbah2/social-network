import useGetData from "@/lib/hooks/useget";
import { mapPost } from "@/lib/modelmapper";
import Post from "./postCompoment";

export default function Home() {

  const dataPost = useGetData('/posts', mapPost)

  console.log("datajs", dataPost);

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