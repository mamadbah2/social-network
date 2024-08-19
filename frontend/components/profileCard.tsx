import Image from "next/image";
export const ProfileCard = () => {
  return (
    <div className="w-full hidden xl:flex flex-col justify-center gap-4 bg-[#F5F6FA] rounded-lg py-2">
      <div className="flexColBox w-fit xl:w-full xl:gap-2">
        <div className="">
          <Image
            src="/wall.jpg"
            width={50}
            height={50}
            className="rounded-full size-12"
            alt=""
          />
        </div>
        <div className="none xl:flexColBox">
          <p className="font-medium">Cherif Nzale</p>
          <p className="text-zinc-400">azermax123zale@gmail.com</p>
        </div>
      </div>
      <div className="flex justify-around items-center ">
        <div className="flexColBox">
          <p>5.5k</p>
          <p className="font-medium">Follower</p>
        </div>
        <div className="flexColBox">
          <p>195</p>
          <p className="font-medium">Following</p>
        </div>
        <div className="flexColBox">
          <p>300</p>
          <p className="font-medium">Post</p>
        </div>
      </div>
    </div>
  );
};
