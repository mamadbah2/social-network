"use clients";
import { Button } from "@/components/button";
import GroupForum from "./groupForum";
import Post from "./postCard";
export const MiddleContainer = () => {
  return (
    <section className="flex flex-col justify-start items-center container-bg h-full w-full ">
      <div className="flex justify-around items-center gap-96 bg-white w-full h-20">
        <div className="text-2xl">Post</div>
        <div className="">
          <Button link="/register" content="Create Post"></Button>
        </div>
      </div>
      <div className="w-full h-screen overflow-scroll space-y-10 rounded-t-2xl bg-[#F5F6FA] p-10">
        <GroupForum />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </section>
  );
};
