import { message } from 'antd';
import React, { createContext } from 'react';

export const MessageContext = createContext(null);

export const Provider = (props) => {
  const [messageApi] = message.useMessage();

  return (
    <MessageContext.Provider value={[messageApi]}>
      {props.children}
    </MessageContext.Provider>
  );
};
