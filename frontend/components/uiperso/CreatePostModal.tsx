"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import postData from "@/lib/hooks/usepost";
import { mapSimplePost, mapSimpleUser } from "@/lib/modelmapper";
import { User } from "@/models/user.model";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Item {
  id: number;
  name: string;
}

export default function CreatePostModal({ isOpen, onClose }: PostModalProps) {
  const [userID, setUserID] = React.useState<string>("0");
  useEffect(() => {
    setUserID(localStorage.getItem("userID") || "0");
  }, []);

  const [privacy, setPrivacy] = useState<string>("public");
  const [selectedUsers, setSelectedUsers] = useState<Item[]>([]);
  const [search, setSearch] = useState<string>("");
  const [ItemUser, setItemUser] = React.useState<Item[]>([]);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);
  const router = useRouter();
  const { setPostTable } = usePostContext();
  const { expect: user, error: errUser } = useGetData<User>(
    `/users?id=${userID}`,
    mapSimpleUser
  );

  useEffect(() => {
    if (
      user?.followers &&
      (user?.followers).length > 0 &&
      ItemUser.length === 0
    ) {
      setItemUser(
        (user?.followers).map((u: any) => ({
          id: u.id,
          name: u.firstname,
        }))
      );
    }
  }, [user, ItemUser]); // Add data as a dependency

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim() || "";

    // Validate title and content
    if (title === "" || content === "") {
      setIsTitleValid(title !== "");
      setIsContentValid(content !== "");
      return;
    }
    console.log("privacy :>> ", privacy);

    formData.set("privacy", privacy);

    if (privacy === "almost private") {
      const selectedUserIds = selectedUsers.map((user) => user.id);
      selectedUserIds.forEach((id) => {
        formData.append(`followers`, id.toString());
      });
    }
    let target = e.currentTarget;
    const [resp, err] = await postData("/posts", formData, true);

    if (Object.keys(err).length == 0) {
      setSelectedUsers([]);
      let onePost = mapSimplePost(resp);

      // Add the new post to the top of the post table if the location isn't /
      setPostTable((prev) => [onePost, ...(prev ?? [])]);
      onClose();
    } else {
      console.log("ERR :>>", err);
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

  const handleAddUser = (user: Item) => {
    if (!selectedUsers.some((u) => u.name === user.name)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
  };

  const handleRemoveUser = (user: Item) => {
    setSelectedUsers(selectedUsers.filter((u) => u.name !== user.name));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
                isTitleValid
                  ? "border-gray-300 focus:border-indigo-500"
                  : "border-red-500"
              }`}
              required
            />
            {!isTitleValid && (
              <p className="text-red-500 text-sm mt-1">
                Post title is required.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
                isContentValid
                  ? "border-gray-300 focus:border-indigo-500"
                  : "border-red-500"
              }`}
              rows={3}
            />
            {!isContentValid && (
              <p className="text-red-500 text-sm mt-1">Content is required.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium text-gray-700">
              Post privacy
            </label>
            <Select onValueChange={(value) => setPrivacy(value)} name="privacy">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Post Privacy</SelectLabel>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="almost private">Almost Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Conditionally render user selection input if "Almost Private" is selected */}
          {privacy === "almost private" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Specify users
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search users"
                />
                {search && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {ItemUser.filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase())
                    ).map((user) => (
                      <div
                        key={user.name}
                        onClick={() => handleAddUser(user)}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                      >
                        {user.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center bg-gray-200 text-sm font-medium text-[#292929] p-1 m-1 rounded"
                  >
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="ml-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <Image
                        src="cancel.svg"
                        width={15}
                        height={15}
                        alt="cancel icon"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium text-gray-700">
              Image
            </label>
            <Input type="file" name="imagePost" />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#292929] hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
