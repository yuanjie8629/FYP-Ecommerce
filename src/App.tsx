import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { Grid, message, notification } from 'antd';
import { useIdleTimer } from 'react-idle-timer';
import { useTimer } from 'react-timer-hook';
import { refreshTknAPI } from '@api/services/authAPI';
import {
  getCartItem,
  getSessionExp,
  getUserId,
  refreshCart,
} from '@utils/storageUtils';
import moment from 'moment';
import { CartContext } from '@contexts/CartContext';
import { useEffect, useState } from 'react';
import { cartDetailsAPI } from '@api/services/cartAPI';
import { MessageContext } from '@contexts/MessageContext';
import { NotificationContext } from '@contexts/NotificationContext';
import { itemPrevByIdsAPI } from '@api/services/productAPI';

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
    top: screens.md && 80,
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
      console.log('Retrieving cart items...');
      cartDetailsAPI()
        .then((res) => {
          setCart(res.data.items);
        })
        .catch((res) => {});
      console.log('Retrieved cart items.');
    } else if (getCartItem()) {
      console.log('Retrieving cart items...');
      itemPrevByIdsAPI(getCartItem().map((item) => item.id)).then((res) => {
        let new_cart = [];
        res.data.results.forEach((item) => {
          let qty = getCartItem().find(
            (cartItem) => cartItem.id === item.id
          ).quantity;
          new_cart.push({
            ...item,
            quantity: item.stock ===0 || item.stock >= qty ? qty : item.stock,
          });
        });
        setCart(new_cart);
        refreshCart(new_cart);
        console.log('Retrieved cart items.');
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
