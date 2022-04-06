import { Grid, message } from 'antd';
import React, { createContext } from 'react';

export const MessageContext = createContext(null);

export const MessageProvider = (props) => {
  const [messageApi] = message.useMessage();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  message.config({
    maxCount: 1,
    duration: 3,
    top: screens.md && 50,
  });

  return (
    <MessageContext.Provider value={[messageApi, MessageContext]}>
      {props.children}
    </MessageContext.Provider>
  );
};
