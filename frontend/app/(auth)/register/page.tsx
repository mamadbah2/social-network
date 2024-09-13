"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import postData from "@/lib/hooks/usepost";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AuthLayout from "../layout";

export default function Register() {
  const [file, setFile] = useState(undefined);
  const [privacy, setPrivacy] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);
    if (!privacy) formData.append("privacy", "public");
    const [, err] = await postData("/register", formData, true);

    if (Object.keys(err).length == 0) {
      router.push("/login");
    } else {
      Object.keys(err).forEach((key) => {
        console.log("key :>> ", key);
        target.querySelector(`[name=${key}]`)?.classList.add("border-red-500");
        setTimeout(() => {
          target
            .querySelector(`[name=${key}]`)
            ?.classList.remove("border-red-500");
        }, 2000);
      });
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="POST"
        className="max-w-[500px] flex flex-wrap gap-4 bg-white p-5 justify-between rounded-lg text-center border border-gray-200"
      >
        <h1 className="block font-bold text-4xl w-full">Sign In</h1>
        <div className="flex justify-between w-full gap-4">
          <Input
            type="text"
            name="firstname"
            placeholder="Enter your firstname"
          />
          <Input
            type="text"
            name="lastname"
            placeholder="Enter your lastname"
          />
        </div>
        <Input type="text" name="nickname" placeholder="Enter your nickname" />
        <Input type="mail" name="email" placeholder="Enter your email" />
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
        />
        <Input type="date" name="dateOfBirth" />
        <Textarea placeholder="About Me" name="aboutMe" />
        <Input type="file" name="profilPicture" value={file} />
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              onClick={() => {
                setPrivacy(!privacy);
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Private account
            </label>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {" "}
          Sign In{" "}
        </Button>
        <p className="text-gray-600 text-sm">
          You don&apos;t have an account?
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
