import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImUsers } from 'react-icons/im';
import { CgDetailsMore } from 'react-icons/cg';
import { FaUserLock } from 'react-icons/fa';

const MoreOptions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        to="#"
      >
        <CgDetailsMore />
      </Link>

      {/* Dropdown Start */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-2.5 w-48 flex flex-col rounded-sm bg-white shadow-default dark:bg-boxdark ${
          dropdownOpen ? 'block' : 'hidden'
        } sm:right-0 sm:w-64 border border-stroke border-transparent sm:border-gray-300`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Manage</h5>
        </div>
        <div className="p-3">
          <div className="mb-5.5 space-y-5.5 sm:flex sm:flex-row sm:space-y-0 sm:gap-5.5">
            <div className="w-full sm:w-1/2 pr-4 sm:border-r border-gray-300">
              <li>
                <Link
                  to="/dashboard/staff"
                  className="flex items-center justify-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <ImUsers className="text-3xl" />
                  Staff
                </Link>
              </li>
            </div>
            <div className="w-full sm:w-1/2 pl-4">
              <li>
                <Link
                  to="/dashboard/users-and-roles"
                  className="flex items-center justify-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <FaUserLock className="text-3xl" />
                  Roles
                </Link>
              </li>
            </div>
          </div>
        </div>
      </div>
      {/* Dropdown End */}
    </li>
  );
};

export default MoreOptions;
