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
import { getCartItemCount, getUserEmail, getUserId } from '@utils/storageUtils';
import Cart from '@pages/Cart';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import AccountDrawer from '@components/Drawer/AccountDrawer';

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
  const [cart, setCart] = useContext(CartContext);
  const [messageApi] = useContext(MessageContext);
  const [showAcc, setShowAcc] = useState(false);

  useEffect(() => {
    if (searchParams.has('name')) {
      setSearch(searchParams.get('name'));
    }
  }, [searchParams]);

  const handleLogout = () => {
    logoutAPI();
    setCart([]);
    messageApi.open({
      key: 'successLogout',
      type: 'success',
      content: 'You have logout successfully',
    });
    setTimeout(() => messageApi.destroy(), 5000);
  };

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
          <Space size={screens.sm ? 40 : 30} align='center'>
            <Space size={30}>
              {screens.sm && (
                <HiOutlineUser
                  style={{ fontSize: 25, cursor: 'pointer' }}
                  className={getUserEmail() && 'color-primary'}
                  onClick={() => {
                    if (getUserId()) setShowAcc(true);
                    else if (screens.md) LoginRegModal.show('login');
                    else navigate(findRoutePath('login'));
                  }}
                />
              )}
              <Badge
                count={cart.length || getCartItemCount()}
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
      <AccountDrawer
        visible={showAcc}
        maskClosable
        onClose={() => {
          setShowAcc(false);
        }}
        onMenuClick={(route) => {
          if (route === 'logout') {
            handleLogout();
          }

          setShowAcc(false);
        }}
      />

      <Cart
        visible={showCart}
        maskClosable
        onClose={() => {
          setShowCart(false);
        }}
      />

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
            handleLogout();
          }

          if (route === 'profile') {
            setShowAcc(true);
          }
        }}
      />
      <LoginRegModal />
    </Header>
  );
};

export default Header;
