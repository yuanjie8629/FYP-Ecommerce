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
import { CartContext } from '@contexts/CartContext';
import { useEffect, useState } from 'react';
import { cartDetailsAPI } from '@api/services/cartAPI';
import { MessageContext } from '@contexts/MessageContext';
import { NotificationContext } from '@contexts/NotificationContext';

function App() {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [cart, setCart] = useState([]);
  const [messageApi, messageContext] = message.useMessage();
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
      : new Date(null),
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
        setCart(res.data.items);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserId()]);

  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <MessageContext.Provider value={[messageApi, messageContext]}>
          {messageContext}
          <NotificationContext.Provider value={[notificationAPI, notiContext]}>
            {notiContext}
            <CartContext.Provider value={[cart, setCart]}>
              <Routes />
            </CartContext.Provider>
          </NotificationContext.Provider>
        </MessageContext.Provider>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
