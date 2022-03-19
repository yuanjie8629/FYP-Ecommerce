import { message } from 'antd';
import React, { createContext } from 'react';

export const MessageContext = createContext(null);

export const Provider = (props) => {
  const [messageAPI] = message.useMessage();

  return (
    <MessageContext.Provider value={[messageAPI]}>
      {props.children}
    </MessageContext.Provider>
  );
};
