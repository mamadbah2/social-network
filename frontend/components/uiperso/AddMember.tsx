import React, { useState } from 'react';
import { User } from '@/models/user.model';

interface AddMemberFormProps {
  users: User[];
  onSave: (selectedUserIds: number[]) => void;
  onCancel: () => void;
}

const AddMemberComponent: React.FC<AddMemberFormProps> = ({ users, onSave, onCancel }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCheckboxChange = (userId: number) => {
    setSelectedUserIds(prevState =>
      prevState.includes(userId)
        ? prevState.filter(id => id !== userId)
        : [...prevState, userId]
    );
  };

  const handleSave = () => {
    onSave(selectedUserIds);
  };

  const filteredUsers = users.filter(user =>
    `${user.firstname} ${user.lastname} ${user.nickname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">Add Members to Group</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Search Users</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or nickname"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Users</label>
          <div className="mt-2 max-h-40 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user.id}`} className="text-sm">
                    {user.firstname} {user.lastname} ({user.nickname})
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No users found.</p>
            )}
          </div>
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

export default AddMemberComponent;
