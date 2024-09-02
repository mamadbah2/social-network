"use client";

import { Group } from "@/models/group.model";
import { Item } from "@/models/item.model";
import { User } from "@/models/user.model";
import { type ClassValue, clsx } from "clsx";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import useGetData from "./hooks/useGet";
import { mapSimpleSession } from "./modelmapper";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function paginateTable<T>(
  table: T[],
  prev: number,
  suiv: number
): Item[] {
  let current: Array<T> = table.slice(prev, suiv);
  const paginated: Array<Item> = current.map((c: T): Item => {
    return {
      userId: (c as User).id || (c as Group).id,
      name: (c as User).firstname || (c as Group).name || "",
      image: "",
    };
  });

  return paginated;
}

export function calculPagination<T>(
  table: T[],
  prev: number,
  suiv: number,
  step = 4
) {
  if (suiv <= table.length) {
    prev = prev + step;
    suiv = suiv + step;
  } else {
    suiv = 4;
    prev = 0;
  }
}

export default function HandAuth() {
  const router = useRouter();
  const { expect, isLoading, error } = useGetData("/session", mapSimpleSession);
  if (expect) {
    if (String(expect?.id) != localStorage.getItem("cookie")) {
      console.log("session dataBase ->", expect?.id);
      console.log("front session ->", localStorage.getItem("cookie"));
      router.push("/login");
    }
  }
  // console.log(expect?.id);

  // useEffect(() => {
  //   if (localStorage.getItem('cookie') === null) {
  //     redirect('/login')
  //   }
  // })
}
