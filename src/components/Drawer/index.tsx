import LoginRegModal from '@components/Modal/LoginRegModal';
import { findRoutePath } from '@utils/routingUtils';
import { removeSearchParams } from '@utils/urlUtls';
import { getUserEmail } from '@utils/storageUtils';
import {
  Col,
  Drawer as AntdDrawer,
  DrawerProps as AntdDrawerProps,
  Grid,
  Input,
  List,
  Row,
  Space,
  Image,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

interface DrawerProps extends AntdDrawerProps {
  onMenuClick?: (route?) => void;
  onSearch?: (search: string) => void;
}
const Drawer = ({
  onMenuClick = () => null,
  onSearch = () => null,
  ...props
}: DrawerProps) => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routes = [
    { label: 'Home', route: 'home' },
    { label: 'Login', route: 'login' },
    { label: 'Register', route: 'register' },
    { label: 'Become Agent/Dropshipper', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
  ];

  const loginRoutes = [
    { label: 'Home', route: 'home' },
    { label: 'Profile', route: 'profile' },
    { label: 'Become Agent/Dropshipper', route: 'posReg' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <AntdDrawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        <Row align='top'>
          <Col span={1}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                onMenuClick();
              }}
            />
          </Col>
          <Col span={23} style={{ textAlign: 'center' }}>
            <div
              className='header-logo'
              onClick={() => navigate(findRoutePath('home'))}
            >
              <Image
                src='https://res.cloudinary.com/yuanjie/image/upload/v1645908976/logo_mvamgs.png'
                alt='Logo'
                preview={false}
                width={screens.sm ? 120 : 80}
              />
            </div>
          </Col>
        </Row>

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
            rowKey='route'
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
                      console.log(item.route);
                      onMenuClick(item.route);
                      if (
                        ['login', 'register', 'logout', 'profile'].includes(
                          item.route
                        )
                      ) {
                        return;
                      } else {
                        navigate(findRoutePath(item.route));
                      }
                    }}
                  >
                    {item.label}
                  </Title>
                ) : (
                  <Title
                    level={5}
                    className='text-button'
                    onClick={() => {
                      onMenuClick(item.route);
                      if (
                        ['login', 'register', 'logout', 'profile'].includes(
                          item.route
                        )
                      ) {
                        return;
                      }
                      navigate(findRoutePath(item.route));
                    }}
                  >
                    {item.label}
                  </Title>
                )}
              </List.Item>
            )}
          />
        </Space>
      </Space>
      <LoginRegModal />
    </AntdDrawer>
  );
};

export default Drawer;
