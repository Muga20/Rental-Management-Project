import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import { FaBriefcase, FaCalendar } from 'react-icons/fa';
import { MdSpaceDashboard ,  MdOutlinePayment } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import {  FaHouseChimneyWindow } from 'react-icons/fa6';


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Configuration object for sidebar menu items
const menuItems = [
  { icon: <MdSpaceDashboard />, text: 'Dashboard', path: '/dashboard' },
  { 
    icon: <FaBriefcase />, 
    text: 'Company', 
    submenu: [
      { text: 'Companies', path: '/company' },
      { text: 'Profile', path: '/company/profile' }
    ]
  },
  { 
    icon: <FaHouseChimneyWindow />, 
    text: 'Homes', 
    submenu: [
      { text: 'Homes', path: '/home' },
      { text: 'My House', path: '/home/my-house' }
    ]
  },
  { icon: <FaCalendar />, text: 'Calendar', path: '/dashboard/calendar' },
  { 
    icon: <MdOutlinePayment />, 
    text: 'Plans', 
    submenu: [
      { text: 'Plans', path: '/plan' },
      { text: 'Subscriptions', path: '/plan/subscriptions' }
    ]
  },

  { icon: <IoMdSettings />, text: 'Settings', path: '/setting' },
];


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          {/* Add your button content here if necessary */}
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              {menuItems.map((menuItem, index) => (
                <React.Fragment key={index}>
                  {menuItem.submenu ? (
                    <SidebarLinkGroup
                      activeCondition={menuItem.submenu.some(submenuItem =>
                        pathname.includes(submenuItem.path)
                      )}
                    >
                      {(handleClick, open) => (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              menuItem.submenu.some(submenuItem =>
                                pathname.includes(submenuItem.path)
                              ) &&
                              'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            {menuItem.icon}
                            {menuItem.text}
                          </NavLink>

                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && 'hidden'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              {menuItem.submenu.map((submenuItem, subIndex) => (
                                <li key={subIndex}>
                                  <NavLink
                                    to={submenuItem.path}
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    {submenuItem.text}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      )}
                    </SidebarLinkGroup>
                  ) : (
                    <li>
                      <NavLink
                        to={menuItem.path}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(menuItem.path) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        {menuItem.icon}
                        {menuItem.text}
                      </NavLink>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;

