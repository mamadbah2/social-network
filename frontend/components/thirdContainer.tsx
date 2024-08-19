import { Box1 } from "./Box1";
import { Box2 } from "./Box2";

export const ThirdContainer = () => {
  return (
    <section className="flex flex-col justify-between items-center gap-6 container-bg h-full w-1/4">
      <Box1 />
      <Box2 />
    </section>
  );
};
