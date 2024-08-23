"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export type LinkProps = PropsWithChildren<{
  content: string | "";
  link: string | "";
  imageSrc: string | "";
  color: string | "#32303D";
  activeColor: string | "#32303D"; // Add activeColor prop for active state
  onClick?: () => void;
}>;

export const LinkImage = (props: LinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === props.link;

  return (
    <Link
      href={props.link}
      className="flex w-max justify-start text-xl gap-2"
      style={{
        color: isActive ? props.activeColor : props.color,
      }}
      onClick={props.onClick}
    >
      <Image
        src={props.imageSrc}
        width={25}
        height={25}
        alt=""
        style={{
          filter: isActive
            ? "invert(57%) sepia(98%) saturate(3726%) hue-rotate(218deg) brightness(100%) contrast(100%)"
            : "none",
        }}
      />
      <p className="none xl:flex">{props.content}</p>
    </Link>
  );
};
