// import {} from "@/components/button"
import { NavBar } from "@/components/NavBar";
import { MiddleContainer } from "@/components/middleContainer";
import { ThirdContainer } from "@/components/thirdContainer";
export default function Home() {
  return (
    <div className="px-8 flex justify-center items-center w-full h-screen">
      <NavBar />
      <MiddleContainer />
      <ThirdContainer />
    </div>
  );
}
