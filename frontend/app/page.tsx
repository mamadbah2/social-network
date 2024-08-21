import NavigationBar from "@/components/NavigationBar";
import SideBarList from "@/components/SideBarList";
import PostCard from "@/components/SocialMediaPost";
import SocialMediaLayout from "./socialMediaLayout";

export default function Home() {
  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList />}
      section={<PostCard />}
    />
  );
}
