import LoginRegModal from '@components/Modal/LoginRegModal';
import { findRoutePath } from '@utils/routingUtils';
import { removeSearchParams } from '@utils/urlUtls';
import { getUserEmail } from '@utils/storageUtils';
import {
  Drawer as AntdDrawer,
  DrawerProps as AntdDrawerProps,
  Grid,
  Input,
  List,
  Space,
  Typography,
} from 'antd';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

interface DrawerProps extends AntdDrawerProps {
  onMenuClick?: (route) => void;
  onSearch?: (search: string) => void;
}
const Drawer = ({
  onMenuClick = () => null,
  onSearch = () => null,
  ...props
}: DrawerProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routes = [
    { label: 'Home', route: 'home' },
    { label: 'Login', route: 'login' },
    { label: 'Register', route: 'register' },
    { label: 'Become Agent/Dropshipepr', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
  ];

  const loginRoutes = [
    { label: 'Home', route: 'home' },
    { label: 'Profile', route: 'profile' },
    { label: 'Become Agent/Dropshipepr', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <AntdDrawer width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        {!screens.md && (
          <Input.Search
            placeholder='Search items'
            onSearch={(value) => {
              if (value) {
                navigate({
                  pathname: findRoutePath('searchItem'),
                  search: createSearchParams({ name: value }).toString(),
                });
              } else {
                setSearchParams(removeSearchParams(searchParams, 'name'));
                if (location.pathname === '/item/search')
                  navigate(findRoutePath('home'));
              }
            }}
          />
        )}
        <List
          dataSource={
            getUserEmail()
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
                    if (
                      ['login', 'register', 'logout'].includes(item.route) &&
                      screens.md
                    ) {
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
                    onMenuClick(item.route);
                    if (
                      ['login', 'register', 'logout'].includes(item.route) &&
                      screens.md
                    ) {
                      return;
                    }
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
