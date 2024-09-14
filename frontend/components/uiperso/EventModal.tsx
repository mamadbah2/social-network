import postData from "@/lib/hooks/usepost";
import { FormEvent } from "react";
import { Button } from "../ui/button";
import UseWS from "@/lib/hooks/usewebsocket";
import { Notification } from "@/models/notification.model";
import useGetData from "@/lib/hooks/useGet";
import { mapGroup } from "@/lib/modelmapper";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  GroupId: string;
}

export default function EventModal({
  isOpen,
  onClose,
  GroupId,
}: EventModalProps) {
  const { sendObject: sendNotification } = UseWS();
  const { expect: groups } = useGetData('/groups?id=' + GroupId, mapGroup);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Trim input values to remove extra spaces
    const title = (formData.get("title") as string).trim();
    const date = (formData.get("date") as string).trim();
    const time = (formData.get("time") as string).trim();
    const description = (formData.get("description") as string).trim();

    // Validation: Check if fields are empty after trimming
    const invalidFields: string[] = [];
    if (!title) invalidFields.push("title");
    if (!date) invalidFields.push("date");
    if (!time) invalidFields.push("time");
    if (!description) invalidFields.push("description");

    // If any field is invalid, add the error styling and stop the form submission
    if (invalidFields.length > 0) {
      invalidFields.forEach((field) => {
        const input = e.currentTarget.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("border-red-500");
        }
      });
      e.currentTarget.querySelector(".error-message")?.classList.remove("hidden");
      return;
    }

    // Reset invalid inputs to normal if they are valid now
    e.currentTarget.querySelectorAll("input, textarea").forEach((input) => {
      input.classList.remove("border-red-500");
    });
    e.currentTarget.querySelector(".error-message")?.classList.add("hidden");

    formData.set("group_id", GroupId);
    const [resp, err] = await postData('/events', formData, false);
    
    if (resp && groups) {
      groups[0]?.members?.forEach((member) => {
        let notif: Notification = {
          entityType: "event",
          content: `New event: ${title}`,
          approuved: false,
          entityId: resp.id,
          sender: { id: parseInt(`${localStorage.getItem("userID")}`) },
          receiver: member,
        };
        if (member.id !== parseInt(`${localStorage.getItem("userID")}`)) {
          sendNotification(notif);
        }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <p className="error-message text-red-500 mb-4 hidden">
            All fields are required and cannot be just spaces.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Name
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
              Date
            </label>
            <input
              type="date"
              name="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              name="time"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={onClose} variant="outline" className="bg-black text-white">
              Cancel
            </Button>
            <Button type="submit" variant="outline">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
