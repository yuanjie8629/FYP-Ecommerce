import LoginRegModal from '@components/Modal/LoginRegModal';
import { findRoutePath } from '@utils/routingUtils';
import {
  Drawer as AntdDrawer,
  DrawerProps as AntdDrawerProps,
  Grid,
  List,
  Space,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  email: string;
}

interface DrawerProps extends AntdDrawerProps {
  user?: UserInfo;
  onMenuClick?: (route) => void;
}
const Drawer = ({ onMenuClick = () => null, user, ...props }: DrawerProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const routes = [
    { label: 'Home', route: 'home' },
    { label: 'Login', route: 'login' },
    { label: 'Register', route: 'register' },
    { label: 'Cart', route: 'cart' },
    { label: 'Become Agent/Dropshipepr', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
  ];

  const loginRoutes = [
    { label: 'Home', route: 'home' },
    { label: 'Profile', route: 'profile' },
    { label: 'Cart', route: 'cart' },
    { label: 'Become Agent/Dropshipepr', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <AntdDrawer width={screens.sm ? 378 : '80%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        {user.email && screens.sm ? (
          <Title level={5}>Welcome, {user.email}</Title>
        ) : (
          user.email && <Text strong>Welcome, {user.email}</Text>
        )}
        <List
          dataSource={
            user.email
              ? loginRoutes.map((route) => route)
              : routes.map((route) => route)
          }
          renderItem={(item) => (
            <List.Item className='text-button-wrapper'>
              {screens.sm ? (
                <Title
                  level={5}
                  className='text-button '
                  onClick={() => {
                    onMenuClick(item.route);
                    if (['login', 'register'].includes(item.route)) {
                      return;
                    }

                    navigate(findRoutePath(item.route));
                  }}
                >
                  {item.label}
                </Title>
              ) : (
                <Text
                  strong
                  className='text-button text-sm'
                  onClick={() => {
                    navigate(findRoutePath(item.route));
                  }}
                >
                  {item.label}
                </Text>
              )}
            </List.Item>
          )}
        />
      </Space>
      <LoginRegModal />
    </AntdDrawer>
  );
};

export default Drawer;
