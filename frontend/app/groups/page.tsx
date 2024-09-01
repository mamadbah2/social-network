import PostCard from "@/components/uiperso/PostCard";

// Example post data
const posts = [
  {
    id: 1,
    username: "Cherif",
    avatarSrc: "/placeholder.svg",
    date: "01/03/2024",
    title: "Create stunning AI videos",
    content:
      "Create stunning AI videos for free with Haiper AI. Just upload an image or type a text prompt...",
    imageSrc: "/wall.jpg",
    likes: 1500,
    shares: 100,
    comments: 1500,
  },
  {
    id: 2,
    username: "Alice",
    avatarSrc: "/avatar2.jpg",
    date: "02/03/2024",
    title: "Explore New Frontiers",
    content:
      "Join us in exploring new frontiers with AI-powered applications...",
    imageSrc: "/ironman.jpeg",
    likes: 1200,
    shares: 80,
    comments: 1300,
  },
  {
    id: 2,
    username: "Alice",
    avatarSrc: "/avatar2.jpg",
    date: "02/03/2024",
    title: "Explore New Frontiers",
    content:
      "Join us in exploring new frontiers with AI-powered applications...",
    imageSrc: "/ironman.jpeg",
    likes: 1200,
    shares: 80,
    comments: 1300,
  },
  {
    id: 2,
    username: "Alice",
    avatarSrc: "/avatar2.jpg",
    date: "02/03/2024",
    title: "Explore New Frontiers",
    content:
      "Join us in exploring new frontiers with AI-powered applications...",
    imageSrc: "/ironman.jpeg",
    likes: 1200,
    shares: 80,
    comments: 1300,
  },
  {
    id: 2,
    username: "Alice",
    avatarSrc: "/avatar2.jpg",
    date: "02/03/2024",
    title: "Explore New Frontiers",
    content:
      "Join us in exploring new frontiers with AI-powered applications...",
    imageSrc: "/ironman.jpeg",
    likes: 1200,
    shares: 80,
    comments: 1300,
  },
  // Add more posts as needed
];

export default function Home() {
  
  return (
    <div className="space-y-4">
      {" "}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          username={post.username}
          avatarSrc={post.avatarSrc}
          date={post.date}
          title={post.title}
          content={post.content}
          imageSrc={post.imageSrc}
          likes={post.likes}
          dislikes={post.shares}
          comments={post.comments}
        />
      ))}
    </div>
  );
}
