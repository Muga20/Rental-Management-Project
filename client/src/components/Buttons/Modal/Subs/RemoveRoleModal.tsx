import React, { useState } from 'react';
import { api } from '../../../../middleware/Api';

interface Role {
  id: string;
  name: string;
  // other properties
}

interface RemoveRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  rolesEndpoint: string;
  rolesMessage: string;
  userRoles: Role[];
  userId: string;
}

const RemoveRoleModal: React.FC<RemoveRoleModalProps> = ({
  isOpen,
  onClose,
  fetchData,
  rolesEndpoint,
  rolesMessage,
  userRoles,
  userId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const handleRemoveRole = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedRoleId) {
        setError('Please select a role');
        return;
      }

      const response = await api(
        `/roles/delete_role_action/${userId}/${selectedRoleId}`,
        'DELETE',
        {}
      );

      console.log('Role removed successfully:', response);
      fetchData();
      onClose();
    } catch (error) {
      setError('Error removing role. Please try again.');
      console.error('Error removing role:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRemoveRole();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white py-6 dark:border-strokedark dark:bg-[#1A222C] rounded-lg p-5 shadow-lg w-96">
        <h3 className="mb-5 text-lg font-normal text-black dark:text-bodydark1">
          {rolesMessage}
        </h3>
        <form onSubmit={onSaveChanges}>
          <div className="mb-4">
            <label htmlFor="roles" className="block mb-2 text-sm font-medium text-black dark:text-bodydark1">
              Select Role
            </label>
            <select
              id="roles"
              className="block w-full p-2.5 text-sm rounded-lg border border-stone-300 dark:border-gray-600 dark:border-strokedark dark:bg-boxdark dark:text-stone-400"
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="">Select a role</option>
              {userRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 md:p-5 text-center">
            <button
              type="submit"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-5"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Remove Role'}
            </button>
            <button
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default RemoveRoleModal;
