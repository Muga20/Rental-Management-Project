import React, { useState } from 'react';
import AddRoleModal from './Subs/AddRoleModal';
import RemoveRoleModal from './Subs/RemoveRoleModal';

interface Role {
  id: string;
  name: string;
  // other properties
}

interface RolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  rolesEndpoint: string;
  rolesMessage: string;
  roles: Role[];
  userId: string;
  userRoles: Role[];
}

const RolesModal: React.FC<RolesModalProps> = ({
  isOpen,
  onClose,
  fetchData,
  rolesEndpoint,
  rolesMessage,
  roles,
  userId,
  userRoles,
}) => {
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [showRemoveRoleModal, setShowRemoveRoleModal] = useState<boolean>(false);

  const openAddRoleModal = () => {
    setShowAddRoleModal(true);
    setShowRemoveRoleModal(false);
  };

  const openRemoveRoleModal = () => {
    setShowRemoveRoleModal(true);
    setShowAddRoleModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Blur Effect */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
        </div>
      )}

      {/* Roles Modal Content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white py-6 dark:border-strokedark dark:bg-[#1A222C]  rounded-lg p-5 shadow-lg w-96">
            <h3 className="mb-5 text-lg font-normal text-black dark:text-bodydark1">
              {rolesMessage}
            </h3>
            <div className="p-4 md:p-5 text-center flex gap-2">
              <button
                type="button"
                className="text-white bg-green-600 hover:bg-green-800 focus:ring-green-300 dark:focus:ring-green-800 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-5"
                onClick={openAddRoleModal}
              >
                Add Role
              </button>
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={openRemoveRoleModal}
              >
                Remove Role
              </button>
              <button
                type="button"
                className="py-2.5 px-5 pt-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showAddRoleModal && (
        <AddRoleModal
          isOpen={showAddRoleModal} 
          onClose={() => setShowAddRoleModal(false)}
          fetchData={fetchData}
          rolesEndpoint={rolesEndpoint}
          rolesMessage={rolesMessage}
          roles={roles}
          userId={userId}
        />
      )}

      {/* Remove Role Modal */}
      {showRemoveRoleModal && (
        <RemoveRoleModal
          isOpen={showRemoveRoleModal} 
          onClose={() => setShowRemoveRoleModal(false)}
          fetchData={fetchData}
          rolesEndpoint={rolesEndpoint}
          rolesMessage={rolesMessage}
          userRoles={userRoles}
          userId={userId}
        />
      )}
    </>
  );
};

export default RolesModal;
