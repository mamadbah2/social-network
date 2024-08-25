import React from "react";

const PostClasses = "max-w-md mx-auto bg-Post rounded-lg shadow-lg p-4";
const textClasses = "text-muted-foreground";
const primaryTextClasses = "text-primary dark:text-primary-foreground";
const secondaryTextClasses = "text-secondary dark:text-secondary-foreground";

interface PostProps {
  title: string;
  date: string;
  description: string;
  imageSrc: string;
  likes: string;
  comments: string;
  shares: string;
  profilePicture: string;
}

const Post: React.FC<PostProps> = ({ title, date, description, imageSrc, likes, comments, shares, profilePicture }) => {
  return (
    <div className={PostClasses}>
      <div className="flex items-center mb-4">
        <img
          className="w-10 h-10 rounded-full"
          src={profilePicture}
          alt="Profile Picture"
        />
        <div className="ml-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className={`text-sm ${textClasses}`}>{date}</p>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">Create stunning AI videos</h3>
      <p className={`${textClasses} mb-4`}>
        {description}
      </p>
      <img className="w-full rounded-lg mb-4" src={imageSrc} alt="AI Video Creation" />
      <div className="flex justify-between text-muted-foreground">
        <span>❤️  {likes}</span>
        <span>💬  {comments}</span>
        <span>🔁  {shares}</span>
      </div>
    </div>
  );
};

export default Post;