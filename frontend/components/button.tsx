import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{
  content: string | "";
  link: string | "";
  onClick?: () => void;
}>;

export const Button = (props: ButtonProps) => {
  return (
    <Link
      href={props.link}
      className="button-color py-3 px-4 xl:py-4 xl:px-10 rounded-md text-white flex justify-center items-center gap-2"
      onClick={props.onClick}
    >
      <Image src="add.svg" width={25} height={25} alt="" />
      <p className="none xl:flex">{props.content}</p>
    </Link>
  );
};

// export default function CreatePostButton() {
//   return (
//     <div className="p-10 flex justify-center items-center">

//     </div>
//   );
// }
