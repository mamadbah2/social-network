"use client";

import { Input } from "@/components/ui/input";
import postData from "@/lib/hooks/usepost";
import React, { FormEvent, useState } from "react";

interface PostModalProps {
  isOpen: boolean;
  group_Id: string;
  onClose: () => void;
}

export default function CreatePostGroupModal({
  isOpen,
  group_Id,
  onClose,
}: PostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // Validate title and content
    if (trimmedTitle === "" || trimmedContent === "") {
      setIsTitleValid(trimmedTitle !== "");
      setIsContentValid(trimmedContent !== "");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("group_id", group_Id);
    formData.set("privacy", "group");
    const [resp, err] = await postData("/posts", formData, true);

    onClose();
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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isTitleValid && e.target.value.trim() !== "") {
                  setIsTitleValid(true);
                }
              }}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
                isTitleValid
                  ? "border-gray-300 focus:border-indigo-500"
                  : "border-red-500"
              }`}
              required
            />
            {!isTitleValid && (
              <p className="text-red-500 text-sm mt-1">Post title is required.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (!isContentValid && e.target.value.trim() !== "") {
                  setIsContentValid(true);
                }
              }}
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
