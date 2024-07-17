import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../../constants/UserData';
import { api } from '../../middleware/Api';
import SVGIcons from '../Icons/SVGIcons';
import setupWebSocketConnection from '../../config/socketConnection';
import { useAlert } from '../../context/AlertContext';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  type: string;
  company_of_interest: string;
}

const DropdownNotification: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { channels } = useUserData();
  const { setAlert } = useAlert();

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        (trigger.current && trigger.current.contains(target as Node))
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let echo: any;

    const setupWebSocket = () => {
      try {
        echo = setupWebSocketConnection();

        if (channels && channels.length > 0) {
          channels.forEach((channel) => {
            echo
              .channel('notifications')
              .listen(
                channel.event,
                (event: { notification: Notification }) => {
                  setNotifications((prevNotifications) => [
                    event.notification,
                    ...prevNotifications,
                  ]);
                  console.log('Received notification:', event.notification);
                },
              );
          });
        } else {
          setError('No channels available');
        }
      } catch (err) {
        setError('Error setting up WebSocket connection');
      }
    };

    if (channels && channels.length > 0) {
      setupWebSocket();
    } else {
      setError('Channels are not defined or empty');
    }

    return () => {
      if (echo) {
        echo.disconnect();
      }
    };
  }, [channels]);

  const fetchNotifications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/communication/notifications', 'GET');

      
      if (response && response.notifications) {
        setNotifications(response.notifications);
      } else {
        setError('Invalid response structure');
      }

      setLoading(false);
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null,
      });
      setLoading(false);
    }
  };

  const removeNotification = async (
    id: number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    try {
      await api(`/communication/delete_notification/${id}`, 'DELETE');
      setNotifications(
        notifications.filter((notification) => notification.id !== id),
      );
    } catch (err) {
      setError('Error deleting notification');
    }
  };

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        to="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span
          className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
            notifications.length > 0 ? 'inline' : 'hidden'
          }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <SVGIcons iconName="bell" />
      </Link>

      <div
        ref={dropdown}
        className={`absolute -right-27 mt-2.5 flex w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Notifications</h5>
        </div>

        <ul className="flex h-76 flex-col overflow-y-auto">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && notifications.length === 0 && (
            <p className="pl-3 py-3">No notifications found</p>
          )}
          {notifications.map((notification) => (
            <li key={notification.id}>
              <div className="flex justify-between items-center gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <div className="flex flex-col">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs">
                    Date: {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={(e) => removeNotification(notification.id, e)}>
                  &times;
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default DropdownNotification;
