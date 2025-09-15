import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification, { NotificationProps } from './Notification';

interface NotificationContainerProps {
  notifications: NotificationProps[];
  onRemoveNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemoveNotification
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onRemoveNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
