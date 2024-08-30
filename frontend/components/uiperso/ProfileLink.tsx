"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";
export type profileProps = PropsWithChildren<{
  id: number | null;
}>;

export default function ProfileLink({ id, children }: profileProps) {
  return <Link href={`/profile/${id}`}>{children}</Link>;
}
