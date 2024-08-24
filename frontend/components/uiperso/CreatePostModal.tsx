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
import Image from "next/image";

import { FormEvent, useState } from "react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    privacy: string;
    extraPrivacy?: string;
    selectedUsers?: string[];
  }) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: PostModalProps) {
  const [privacy, setPrivacy] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  const allUsers = ["Safiatou Doumbia", "John Doe", "Jane Smith"]; // Sample list of users

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      privacy,
    };

    // If "Almost Private" is selected, include the selected users
    if (privacy === "almost private") {
      data.selectedUsers = selectedUsers;
    }

    console.log("Form Data:", data);
    onSubmit(data);
    onClose();
  };

  const handleAddUser = (user: string) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch(""); // Clear the search field after adding a user
  };

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit}>
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
            <Select onValueChange={(value) => setPrivacy(value)}>
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
                    {allUsers
                      .filter((user) =>
                        user.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user}
                          onClick={() => handleAddUser(user)}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                        >
                          {user}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap">
                {selectedUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center bg-gray-200 text-sm font-medium text-[#292929] p-1 m-1 rounded"
                  >
                    <span>{user}</span>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="ml-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <Image
                        src="cancel.svg"
                        width={18}
                        height={18}
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
            <Input type="file" />
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
