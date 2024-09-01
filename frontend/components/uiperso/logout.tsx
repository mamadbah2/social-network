"use client";

import { removeSessionToken } from "@/lib/cookie";
import postData from "@/lib/hooks/usepost";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const [resp, err] = await postData("/logout", new FormData());
    if (resp != null) {
      if (Object.keys(resp).length != 0) {
        removeSessionToken();
        localStorage.removeItem("userID");
        localStorage.removeItem("cookie");
        router.push("/login");
      } else {
        alert("failed to logout");
        throw new Error("Failed to logout...");
      }
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="text-muted-foreground"
      size="icon"
    >
      <Image
        src="logout.svg"
        width={25}
        height={25}
        alt="group icon"
        className="h-6 w-6"
      />
    </Button>
  );
}
