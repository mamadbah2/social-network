import { LinkImage } from "./link";
import { ProfileCard } from "./profileCard";
export const NavBar = () => {
  return (
    <section className=" flex flex-col justify-start items-center xl:items-start px-1 py-5 xl:px-8 xl:py-7 bg-[white] h-full w-24 xl:w-1/4 mt-24 gap-11">
      {/* <div className="text-2xl w-full flexBox">Social Network</div> */}
      <ProfileCard />
      <div className="flex flex-col gap-12">
        <LinkImage
          color=""
          link="/"
          content="Home"
          imageSrc="home.svg"
          activeColor="#4D77FF"
        ></LinkImage>
        <LinkImage
          color=""
          link="/groups"
          content="Groups"
          imageSrc="group.svg"
          activeColor="#4D77FF"
        ></LinkImage>
        <LinkImage
          color=""
          link="/messages"
          content="Messages"
          imageSrc="chat.svg"
          activeColor="#4D77FF"
        ></LinkImage>{" "}
        <LinkImage
          color=""
          link="/notifications"
          content="Notifications"
          imageSrc="notification.svg"
          activeColor="#4D77FF"
        ></LinkImage>
        <LinkImage
          color=""
          link="/profile"
          content="Profile"
          imageSrc="user.svg"
          activeColor="#4D77FF"
        ></LinkImage>
        <LinkImage
          color="red"
          link="/register"
          content="LogOut"
          imageSrc="logout.svg"
          activeColor="#4D77FF"
        ></LinkImage>
      </div>
    </section>
  );
};
