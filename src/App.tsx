import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { message } from 'antd';
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
import { serverErrMsg } from '@utils/messageUtils';

function App() {
  const [cart, setCart] = useState([]);
  const [cartPrice, setCartPrice] = useState<number>();
  const idleTimer = useIdleTimer({
    timeout: 10000,
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
    if (window.location.pathname !== '/checkout') {
      if (getUserId()) {
        console.log('Retrieving cart items...');
        cartDetailsForUserAPI()
          .then((res) => {
            setCart(res.data?.items);
            setCartPrice(res.data?.subtotal_price);
            console.log('Retrieved cart items.');
          })
          .catch((err) => {
            if (![401, 404].includes(err.response?.status)) {
              showServerErrMsg();
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
            setCart(res.data?.items);
            setCartPrice(res.data?.subtotal_price);
            refreshCart(res.data?.items);
            console.log('Retrieved cart items.');
          })
          .catch((err) => {
            if (err.response?.status !== 401) {
              showServerErrMsg();
            }
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserId()]);

  const showServerErrMsg = () => {
    message.open(serverErrMsg);
  };

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
