import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { api } from '../../../middleware/Api';
import SVGIcons from '../../../components/Icons/SVGIcons';

interface CreateRoleProps {
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  refreshRoles: () => void;
}

const CreateRole: React.FC<CreateRoleProps> = ({ onClose, refreshRoles }) => {;
  const [alert, setAlert] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });
  const [name, setRoleName] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setAlert({
        success: false,
        message: 'Role name is required.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api('/roles/create-role', 'POST', {}, { name });

      setAlert({
        success: response.success ?? true,
        message: response.message ?? 'Role created successfully.',
      });

      setRoleName('');
      refreshRoles(); 
      // onClose(e);
    } catch (error: any) {
      const errorMessage =
        error?.message || 'An error occurred. Please try again later.';
      setAlert({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const { success, message } = alert;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-96">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">Create New Role</h3>
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          onClick={onClose}
        >
          <SVGIcons iconName="close" />
        </button>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="roleName"
            >
              Role Name<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputFDProp
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="Name"
                value={name}
                onChange={handleChange}
                placeholder="Enter Role Name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C6.37 0 2 4.37 2 9.75h2zm2 5.25a8 8 0 01-8-8H0c0 5.52 4.48 10 10 10v-2z"
                  ></path>
                </svg>
              )}
              {loading ? 'Adding...' : 'Add Role'}
            </button>
          </div>
        </form>
        {message && (
          <div
            className={`p-4 mt-4 text-sm ${
              success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            } rounded-lg`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRole;
