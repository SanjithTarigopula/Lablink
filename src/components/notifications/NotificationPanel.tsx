import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Info,
  CheckCheck,
  Calendar,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking-approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />;
      case 'booking-rejected':
        return <XCircle className="w-3.5 h-3.5 text-[#f87171]" />;
      case 'conflict':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#f0c45a]" />;
      case 'upcoming':
        return <Clock className="w-3.5 h-3.5 text-[#93c5fd]" />;
      case 'new-request':
        return <Calendar className="w-3.5 h-3.5 text-[#f0c45a]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#8e8e8c]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/80"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-[#121311] rounded-[2px] shadow-2xl border border-[#232321] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#0e0f0d] border-b border-[#232321] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#faf8f9] uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono bg-[#221b0c] text-[#f0c45a] border border-[#3d3015] px-1.5 py-0.2 rounded-[2px]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#8e8e8c] hover:text-[#f0c45a] font-normal flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#8e8e8c] hover:text-[#faf8f9] p-1 cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-[#232321]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#676865]">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 hover:bg-[#181916] transition-colors flex items-start gap-3 cursor-pointer ${
                      !notif.read ? 'bg-[#151613] border-l-2 border-[#f0c45a]' : ''
                    }`}
                  >
                    <div className="w-7 h-7 rounded-[2px] bg-[#0e0f0d] border border-[#232321] flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h5
                          className={`text-xs truncate ${
                            !notif.read ? 'font-medium text-[#faf8f9]' : 'text-[#8e8e8c]'
                          }`}
                        >
                          {notif.title}
                        </h5>
                        <span className="text-[10px] text-[#676865] font-mono shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e8e8c] line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.actionUrl && (
                        <Link
                          to={notif.actionUrl}
                          onClick={onClose}
                          className="inline-block text-[11px] text-[#f0c45a] hover:text-[#f5cf6d] mt-1.5"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
