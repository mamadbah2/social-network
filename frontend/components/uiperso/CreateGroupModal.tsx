import React, { useState } from "react";

interface CreateGroupFormProps {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isGroupNameValid, setIsGroupNameValid] = useState(true); // New state for group name validation

  const handleSave = () => {
    const trimmedGroupName = groupName.trim();
    const trimmedDescription = description.trim();

    if (trimmedGroupName === "" || trimmedDescription === "") {
      setIsGroupNameValid(trimmedGroupName !== ""); // Set validation state
      return;
    }

    onSave(groupName, description);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">Create Your Group</h2>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              if (!isGroupNameValid && e.target.value.trim() !== "") {
                setIsGroupNameValid(true); // Reset validation state if input is corrected
              }
            }}
            // Apply the red border if the group name is invalid
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm ${
              isGroupNameValid
                ? "border-gray-300 focus:border-indigo-500"
                : "border-red-500"
            }`}
          />
          {!isGroupNameValid && (
            <p className="text-red-500 text-sm mt-1">Group Name is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupForm;
