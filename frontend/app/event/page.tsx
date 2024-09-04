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

      <EventModal isOpen={isEventModalOpen} onClose={handleCloseEventModal} />

      <GroupModal isOpen={isGroupModalOpen} onClose={handleCloseGroupModal} />
    </div>
  );
}
