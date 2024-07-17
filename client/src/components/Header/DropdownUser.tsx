import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UseAuthContext } from '../../hooks/UseAuthContext';
import { useUserData } from '../../constants/UserData';
import AccountActive from '../Budge/AccountActive';
import { FaUserAlt } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import CookieService from '../../service/CookiesService';


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { dispatch } = UseAuthContext(); // Ensure the hook is imported correctly
  const navigate = useNavigate();
  const { userData, userRoles } = useUserData();
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
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

  const handleClick = () => {
    CookieService.remove('xx_tgk', { path: '/' });
    dispatch({ type: 'LOGOUT' });
    navigate('/auth');
  };
  

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        {userData ? (
          <>
            <span className="hidden text-right lg:block">
              <span className="flex items-center">
                <AccountActive isActive={userData?.status === 'active'} />
                <span className="block text-sm font-medium text-black dark:text-white">
                  {userData.detail.first_name} {userData.detail.middle_name}
                  {userData.detail.last_name}
                </span>
              </span>
              <span className="block text-xs"> {userRoles.join(', ')}</span>
            </span>

            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-200">
              <img
                src={userData.detail.profileImage}
                alt="User"
                className="h-full w-full object-cover"
              />
            </span>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-900 border-opacity-50"></div>
          </div>
        )}

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <FaUserAlt />
              My Profile
            </Link>
          </li>
        </ul>
        <button
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={handleClick}
        >
          <BiLogOut />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
