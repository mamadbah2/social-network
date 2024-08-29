"use client";
import EventModal from "@/components/uiperso/EventModal";
import GroupModal from "@/components/uiperso/GroupModal";
import { useState } from "react";

export default function Home() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleOpenEventModal = () => setIsEventModalOpen(true);
  const handleCloseEventModal = () => setIsEventModalOpen(false);

  const handleOpenGroupModal = () => setIsGroupModalOpen(true);
  const handleCloseGroupModal = () => setIsGroupModalOpen(false);

  const handleEventFormSubmit = async (data: {
    eventName: string;
    date: string;
    time: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Event created successfully");
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("An error occurred while creating the event:", error);
    }
  };

  const handleGroupFormSubmit = async (data: {
    groupName: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Group created successfully");
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("An error occurred while creating the group:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Manager Dashboard</h1>
      <div className="mt-4">
        <button
          onClick={handleOpenEventModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
        >
          Create Event
        </button>
        <button
          onClick={handleOpenGroupModal}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Create Group
        </button>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        onSubmit={handleEventFormSubmit}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={handleCloseGroupModal}
        onSubmit={handleGroupFormSubmit}
      />
    </div>
  );
}
