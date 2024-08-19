"use clients";
import Image from "next/image";
import { LinkImage } from "./link";
const imageStyle = {
  borderRadius: "10px",
  border: "1px solid #fff",
  backgroundSize: "cover",
};
export default function Post() {
  return (
    <div className="xl:w-4/6 mx-auto bg-white rounded-xl overflow-hidden">
      <div className="flex items-center p-4">
        <Image
          src="/wall.jpg"
          width={50}
          height={50}
          className="w-12 h-12 rounded-full"
          alt="User Avatar"
        />
        <div className="ml-4">
          <div className="text-lg font-semibold">Cherif</div>
          <div className="text-lg font-light">01/03/2024</div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="text-xl font-bold">Create stunning AI videos</h2>
        <p className="text-gray-600 mt-2">
          Create stunning AI videos for free with Haiper AI. Just upload an
          image or type a text prompt to effortlessly create hi-def videos for
          social media, your latest ad campaign, or storyboarding. Sign-up for
          free today!
        </p>
      </div>
      <div className="mt-4 relative h-[500px]">
        <Image
          src="/wall.jpg"
          alt="Cover"
          layout="fill"
          objectFit="cover"
          className="w-full"
        />
      </div>

      <div className="flex justify-between items-center p-4 text-gray-600">
        <div className="flex items-center gap-5">
          <LinkImage
            color=""
            link="/like"
            content="1.5k"
            imageSrc="like.svg"
            activeColor=""
          ></LinkImage>
          <LinkImage
            color=""
            link="/dislike"
            content="300"
            imageSrc="dislike.svg"
            activeColor=""
          ></LinkImage>
          <LinkImage
            color=""
            link="/comment"
            content="500"
            imageSrc="addComment.svg"
            activeColor=""
          ></LinkImage>
        </div>
      </div>
    </div>
  );
}
