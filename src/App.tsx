import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { message, notification } from 'antd';
import { useIdleTimer } from 'react-idle-timer';
import { useTimer } from 'react-timer-hook';
import { refreshTknAPI } from '@api/services/authAPI';
import { getSessionExp } from '@utils/storageUtils';
import moment from 'moment';

function App() {
  message.config({ maxCount: 1, top: 80 });
  const idleTimer = useIdleTimer({
    timeout: 10000,
  });

  notification.config({ maxCount: 1, placement: 'bottomRight', duration: 5 });

  const timer = useTimer({
    expiryTimestamp:
      getSessionExp() &&
      moment.unix(getSessionExp()).subtract(15, 'second').toDate(),
    onExpire: () => {
      if (!idleTimer.isIdle())
        refreshTknAPI().then((res) => {
          timer.restart(
            moment.unix(getSessionExp()).subtract(15, 'second').toDate()
          );
        });
    },
  });

  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <Routes />
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
