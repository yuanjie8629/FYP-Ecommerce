import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { Grid, message, notification } from 'antd';
import { useIdleTimer } from 'react-idle-timer';
import { useTimer } from 'react-timer-hook';
import { refreshTknAPI } from '@api/services/authAPI';
import { getSessionExp, getUserId } from '@utils/storageUtils';
import moment from 'moment';
import { AppContext } from '@contexts/AppContext';
import { useEffect, useState } from 'react';
import { cartDetailsAPI } from '@api/services/cartAPI';
import { MessageContext } from '@contexts/MessageContext';
import { NotificationContext } from '@contexts/NotificationContext';

function App() {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [cartItem, setCartItem] = useState([]);
  const [messageAPI, messageContext] = message.useMessage();
  const [notificationAPI, notiContext] = notification.useNotification();
  const idleTimer = useIdleTimer({
    timeout: 10000,
  });

  notification.config({
    maxCount: 1,
    placement: screens.md ? 'bottomRight' : 'top',
    duration: 5,
  });

  message.config({
    maxCount: 1,
    duration: 5,
  });

  const timer = useTimer({
    expiryTimestamp: getSessionExp()
      ? moment.unix(getSessionExp()).subtract(15, 'second').toDate()
      : null,
    onExpire: () => {
      if (!idleTimer.isIdle())
        refreshTknAPI().then((res) => {
          timer.restart(
            moment.unix(getSessionExp()).subtract(15, 'second').toDate()
          );
        });
    },
  });

  useEffect(() => {
    if (getUserId()) {
      cartDetailsAPI().then((res) => {
        setCartItem(res.data.items);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <MessageContext.Provider value={[messageAPI, messageContext]}>
          {messageContext}
          <NotificationContext.Provider value={[notificationAPI, notiContext]}>
            <AppContext.Provider value={[cartItem, setCartItem]}>
              <Routes />
            </AppContext.Provider>
          </NotificationContext.Provider>
        </MessageContext.Provider>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
