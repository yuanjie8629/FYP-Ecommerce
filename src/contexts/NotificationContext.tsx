import { Grid, notification } from 'antd';
import React, { createContext } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = (props) => {
  const [notificationAPI, notificationContext] = notification.useNotification();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  notification.config({
    maxCount: 1,
    placement: screens.md ? 'bottomRight' : 'top',
    duration: 3,
  });

  return (
    <NotificationContext.Provider value={[notificationAPI]}>
      {notificationContext}
      {props.children}
    </NotificationContext.Provider>
  );
};
