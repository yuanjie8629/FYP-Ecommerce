import { Layout, Row, Col, Image, Space, Grid, Input } from 'antd';
import { findRoutePath } from '@utils/routingUtils';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './Header.less';
import Drawer from '@components/Drawer';
import { useEffect, useState } from 'react';
import {
  HiOutlineMenuAlt3,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from 'react-icons/hi';
import { removeSearchParams } from '@utils/urlUtls';
import LoginRegModal from '@components/Modal/LoginRegModal';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
const Header = () => {
  const { Header } = Layout;
  const navigate = useNavigate();
  const location = useLocation();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchParams.has('name')) {
      setSearch(searchParams.get('name'));
    }
  }, [searchParams]);

  let tkn: any =
    Cookies.get('access_token') && jwtDecode(Cookies.get('access_token'));
  return (
    <Header className='header-container'>
      <Row justify='space-between' align='middle' className='header'>
        <Col span={3}>
          <div
            className='header-logo'
            onClick={() => navigate(findRoutePath('home'))}
          >
            <Image
              src='https://res.cloudinary.com/yuanjie/image/upload/v1645908976/logo_mvamgs.png'
              alt='Logo'
              preview={false}
              width={120}
            />
          </div>
        </Col>
        {screens.md && (
          <Col span={8} className='center-flex'>
            <Input.Search
              defaultValue={search}
              placeholder='Search'
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
          </Col>
        )}
        <Col style={{ textAlign: 'right' }}>
          <Space size={40} align='center'>
            <Space size={30}>
              {screens.md && (
                <HiOutlineUser
                  style={{ fontSize: 25, cursor: 'pointer' }}
                  className={tkn?.email && 'color-primary'}
                />
              )}
              {screens.sm && (
                <HiOutlineShoppingCart
                  style={{ fontSize: 25, cursor: 'pointer' }}
                />
              )}
            </Space>
            <HiOutlineMenuAlt3
              style={{ fontSize: 25, cursor: 'pointer' }}
              onClick={() => {
                if (!showDrawer) setShowDrawer(true);
                else setShowDrawer(false);
              }}
            />
          </Space>
        </Col>
      </Row>
      <Drawer
        visible={showDrawer}
        maskClosable
        user={{ email: tkn?.email }}
        onClose={() => {
          setShowDrawer(false);
        }}
        onMenuClick={(route) => {
          setShowDrawer(false);
          if (route === 'login') {
            LoginRegModal.show('login');
          }
          if (route === 'register') {
            LoginRegModal.show('register');
          }

          if (route === 'logout') {
          }
        }}
      />
      <LoginRegModal />
    </Header>
  );
};

export default Header;
