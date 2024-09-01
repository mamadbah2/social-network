'use client'

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
import useGetData from "@/lib/hooks/useget";
import usePostData from "@/lib/hooks/usepost";
import { mapUser } from "@/lib/modelmapper";
import { User } from "@/models/user.model";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    privacy: string;
    extraPrivacy?: string;
    followers?: string[];
  }) => void;
}

interface Item {
  id: number;
  name: string;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: PostModalProps) {
  const { expect:data, error } = useGetData<User[]>('/users', mapUser);
  const [privacy, setPrivacy] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<Item[]>([]);
  // const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [ItemUser, setItemUser] = React.useState<Item[]>([]);  
  useEffect(() => {
    // Only setItemUser if the data has changed
    if (data && data.length > 0 && ItemUser.length === 0) {
      setItemUser(
        data.map((u) => ({
          id: u.Id,
          name: u.firstname,
        }))
      );
    }
  }, [data, ItemUser]);// Add data as a dependency
  


  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("privacy", privacy);
    const data: any = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      privacy: formData.get("privacy") as string,
    };

    // If "Almost Private" is selected, include the selected users
    if (privacy === "almost private") {
      const selectedUserIds = selectedUsers.map(user => user.id);
      // Append the array of user IDs to the formData (as a string)
      formData.append("selectedUserIds", JSON.stringify(selectedUserIds));
  
      // Add the selectedUserIds to data for logging purposes
      data.selectedUserIds = selectedUserIds;
    }

    console.log("Form Data:", data);
    const [resp, err] = await usePostData('/posts', new FormData(e.currentTarget), true)
    // onSubmit(data);
    onClose();
  };

  const handleAddUser = (user: Item) => {
    if (!selectedUsers.some((u) => u.name === user.name)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch(""); // Clear the search field after adding a user
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
            />
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
                <SelectGroup >
                  <SelectLabel >Post Privacy</SelectLabel>
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
                    {ItemUser
                      .filter((user) =>
                        user.name.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((user) => (
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
                        className=""
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
            <Input type="file" name="imagePost"/>
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
