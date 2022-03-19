import { Layout, Row, Col, Image, Space, Grid, Input, Badge } from 'antd';
import { findRoutePath } from '@utils/routingUtils';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './Header.less';
import Drawer from '@components/Drawer';
import { useContext, useEffect, useState } from 'react';
import {
  HiOutlineMenuAlt3,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from 'react-icons/hi';
import { removeSearchParams } from '@utils/urlUtls';
import LoginRegModal from '@components/Modal/LoginRegModal';
import { logoutAPI } from '@api/services/authAPI';
import { getUserEmail } from '@utils/storageUtils';
import Cart from '@pages/Cart';
import { AppContext } from '@contexts/AppContext';

const Header = () => {
  const { Header } = Layout;
  const navigate = useNavigate();
  const location = useLocation();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItem] = useContext(AppContext);
  useEffect(() => {
    if (searchParams.has('name')) {
      setSearch(searchParams.get('name'));
    }
  }, [searchParams]);

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
              width={screens.sm ? 120 : 80}
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
          <Space size={screens.sm ? 40 : 20} align='center'>
            <Space size={30}>
              {screens.sm && (
                <HiOutlineUser
                  style={{ fontSize: 25, cursor: 'pointer' }}
                  className={getUserEmail() && 'color-primary'}
                />
              )}
              <Badge
                count={cartItem.length}
                style={{
                  backgroundColor: '#0e9f6e',
                  color: 'white',
                }}
              >
                <HiOutlineShoppingCart
                  style={{ fontSize: 25, cursor: 'pointer' }}
                  onClick={() => {
                    setShowCart(true);
                  }}
                />
              </Badge>
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
            logoutAPI();
          }
        }}
      />
      <Cart
        visible={showCart}
        maskClosable
        onClose={() => {
          setShowCart(false);
        }}
        onDrawerHide={() => {
          setShowCart(false);
        }}

      />
      <LoginRegModal />
    </Header>
  );
};

export default Header;
