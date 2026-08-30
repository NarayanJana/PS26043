import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/notificationService';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const load = async () => {
    try {
      const { data } = await getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
      load();
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    load();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-md hover:bg-panelLight transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-inkMuted" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-signal rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-panel border border-panelLight rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-panelLight">
            <span className="font-display text-sm font-semibold text-ink50">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-pulse hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-inkMuted p-4">You're all caught up.</p>
          ) : (
            <ul className="divide-y divide-panelLight">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`px-4 py-3 cursor-pointer hover:bg-panelLight transition-colors ${
                    !n.isRead ? 'bg-signal/5' : ''
                  }`}
                >
                  <p className="text-sm text-ink50">{n.title}</p>
                  <p className="text-xs text-inkMuted mt-1">{n.message}</p>
                  <p className="text-[10px] text-inkMuted mt-1 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}