import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
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
import { cartDetailsAPI, cartDetailsForUserAPI } from '@api/services/cartAPI';
import { MessageProvider } from '@contexts/MessageContext';
import { NotificationProvider } from '@contexts/NotificationContext';
import { sortByKey } from '@utils/arrayUtils';

function App() {
  const [cart, setCart] = useState([]);
  const [cartPrice, setCartPrice] = useState<number>();
  const idleTimer = useIdleTimer({
    timeout: 10000,
  });

  const timer = useTimer({
    expiryTimestamp: getSessionExp()
      ? moment.unix(getSessionExp()).subtract(15, 'second').toDate()
      : new Date(),
    onExpire: () => {
      if (getUserId() && !idleTimer.isIdle())
        refreshTknAPI().then((res) => {
          timer.restart(
            moment.unix(getSessionExp()).subtract(15, 'second').toDate()
          );
        });
    },
  });

  useEffect(() => {
    if (window.location.pathname !== '/checkout') {
      if (getUserId()) {
        console.log('Retrieving cart items...');
        cartDetailsForUserAPI()
          .then((res) => {
            setCart(sortByKey(res.data?.items, 'name'));
            setCartPrice(res.data?.subtotal_price);
            console.log('Retrieved cart items.');
          })
          .catch((err) => {
            if (![401, 404].includes(err.response?.status)) {
              return Promise.resolve();
            }
          });
      } else if (getCartItem()) {
        console.log('Retrieving cart items...');
        cartDetailsAPI(
          getCartItem().map((item) => {
            return { id: item.id, quantity: item.quantity };
          })
        )
          .then((res) => {
            setCart(sortByKey(res.data?.items, 'name'));
            setCartPrice(res.data?.subtotal_price);
            refreshCart(res.data?.items);
            console.log('Retrieved cart items.');
          })
          .catch((err) => {
            if (err.response?.status !== 401) {
              return Promise.resolve();
            }
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserId()]);

  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <MessageProvider>
          <NotificationProvider>
            <CartContext.Provider
              value={[cart, setCart, cartPrice, setCartPrice]}
            >
              <Routes />
            </CartContext.Provider>
          </NotificationProvider>
        </MessageProvider>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
