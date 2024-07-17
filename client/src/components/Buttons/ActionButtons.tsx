import React, { useState, useEffect, useRef } from 'react';
import RolesModal from './Modal/RolesModal';
import DeactivateModal from './Modal/DeactivateModal';
import DeleteModal from './Modal/DeleteModal';

interface Role {
  id: string;
  name: string;
  // other properties
}
interface ActionButtonsProps {
  deleteEndpoint: string;
  deactivateEndpoint: string;
  deleteMessage: string;
  deactivateMessage: string;
  actionDeactivateActivateColor: string;
  onDeactivate?: string;
  actionName: string;
  fetchData: () => void;
  rolesEndpoint: string;
  rolesMessage: string;
  roles: Role[];
  userId: string;
  userRoles: Role[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  deleteEndpoint,
  deactivateEndpoint,
  deleteMessage,
  deactivateMessage,
  actionDeactivateActivateColor,
  actionName,
  fetchData,
  rolesEndpoint,
  rolesMessage,
  roles,
  userId,
  userRoles,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleRolesModal = () => {
    setIsRolesModalOpen(!isRolesModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleDeactivateModal = () => {
    setIsDeactivateModalOpen(!isDeactivateModalOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <td className="px-4 py-3 flex items-center justify-end relative">
        <button
          id="user-actions-dropdown-form"
          data-dropdown-toggle="user-actions-dropdown-form"
          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
          type="button"
          onClick={toggleDropdown}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        <div
          ref={dropdownRef}
          id="user-actions-dropdown-form"
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute right-0 mt-2 w-56  bg-[#F1F5F9] rounded divide-y divide-stone-100 shadow dark:bg-[#1A222C] dark:divide-stone-600`}
        >
          <ul
            className="py-1 text-sm text-black dark:text-stone-200"
            aria-labelledby="user-actions-dropdown-form"
          >
            {/* {onEdit && (
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onEdit}
                >
                  Edit
                </a>
              </li>
            )} */}
          </ul>

          {deactivateMessage && (
            <div className={`py-1 `}>
              <button
                className="block py-2 px-4 text-lg text-black hover:bg-gray-100  dark:text-bodydark1 "
                onClick={toggleDeactivateModal}
              >
                {actionName}
              </button>
            </div>
          )}

          {rolesMessage && (
            <div className="py-1">
              <button
                className="block py-2 px-4 text-black hover:bg-gray-100  dark:text-bodydark1 text-lg "
                onClick={toggleRolesModal}
              >
                Roles and Permissions
              </button>
            </div>
          )}

          {deleteMessage && (
            <div className="py-1 bg-red-600">
              <button
                className="block py-2 px-4 text-lg text-black hover:bg-gray-100  dark:text-bodydark1 "
                onClick={toggleDeleteModal}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>

      <RolesModal
        isOpen={isRolesModalOpen}
        onClose={toggleRolesModal}
        rolesEndpoint={rolesEndpoint}
        rolesMessage={rolesMessage}
        fetchData={fetchData}
        roles={roles}
        userId={userId}
        userRoles={userRoles}
      />

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={toggleDeactivateModal}
        deactivateEndpoint={deactivateEndpoint}
        deactivateMessage={deactivateMessage}
        actionDeactivateActivateColor={actionDeactivateActivateColor}
        fetchData={fetchData}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={toggleDeleteModal}
        deleteEndpoint={deleteEndpoint}
        deleteMessage={deleteMessage}
        fetchData={fetchData}
      />
    </div>
  );
};

export default ActionButtons;
