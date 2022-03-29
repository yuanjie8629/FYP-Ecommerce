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
import { logoutAPI } from '@api/services/authAPI';
import { getUserEmail, getUserId } from '@utils/storageUtils';
import Cart from '@pages/Cart';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import AccountDrawer from '@components/Drawer/AccountDrawer';
import Login from '@pages/Login';
import Register from '@pages/Register';

export type drawerProps = 'cart' | 'account' | 'menu';
export type drawerOpenProps = { drawer: drawerProps; from: string };
interface HeaderProps {
  drawerOpen?: drawerOpenProps;
  onDrawerClose?: (drawer: drawerProps) => void;
}

const Header = ({ drawerOpen, onDrawerClose }: HeaderProps) => {
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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRemind, setLoginRemind] = useState(false);
  const [cartViewOnly, setCartViewOnly] = useState(false);

  useEffect(() => {
    if (searchParams.has('name')) {
      setSearch(searchParams.get('name'));
    }
  }, [searchParams]);

  useEffect(() => {
    if (drawerOpen?.drawer === 'cart') {
      setShowCart(true);
      if (drawerOpen.from === 'orderSummary') {
        setCartViewOnly(true);
      }
    } else if (drawerOpen?.drawer === 'account') {
      setShowAcc(true);
    } else if (drawerOpen?.drawer === 'menu') {
      setShowDrawer(true);
    }
  }, [drawerOpen]);

  const handleLogout = () => {
    logoutAPI();
    setCart([]);
    messageApi.open({
      key: 'successLogout',
      type: 'success',
      content: 'You have logout successfully',
    });
    navigate(findRoutePath('home'));
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
              placeholder='Search Item'
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
                    else setShowLogin(true);
                  }}
                />
              )}
              <Badge
                count={cart.length}
                style={{
                  backgroundColor: '#0e9f6e',
                  color: 'white',
                }}
              >
                <HiOutlineShoppingCart
                  style={{
                    fontSize: 25,
                    cursor: location.pathname !== '/checkout' && 'pointer',
                  }}
                  onClick={() => {
                    location.pathname !== '/checkout' && setShowCart(true);
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
          onDrawerClose('account');
        }}
        onMenuClick={(route) => {
          if (route === 'logout') {
            handleLogout();
          } else {
            navigate(findRoutePath(route));
          }
          setShowAcc(false);
          onDrawerClose('account');
        }}
      />

      <Cart
        visible={showCart}
        maskClosable
        onClose={() => {
          setShowCart(false);
          onDrawerClose('cart');
          setTimeout(() => {
            setCartViewOnly(false);
          }, 200);
        }}
        onLoginRemind={() => {
          setLoginRemind(true);
          setShowLogin(true);
        }}
        viewOnly={cartViewOnly}
      />

      <Drawer
        visible={showDrawer}
        maskClosable
        onClose={() => {
          setShowDrawer(false);
          onDrawerClose('menu');
        }}
        onMenuClick={(route) => {
          setShowDrawer(false);
          if (!route) {
            return;
          } else if (route === 'login') {
            setShowLogin(true);
          } else if (route === 'register') {
            setShowRegister(true);
          } else if (route === 'logout') {
            handleLogout();
          } else if (route === 'profile') {
            setShowAcc(true);
          } else {
            navigate(findRoutePath(route));
          }
        }}
      />
      <Login
        visible={showLogin}
        onClose={() => {
          setShowLogin(false);
          setLoginRemind(false);
        }}
        onRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
          setLoginRemind(false);
        }}
        remind={loginRemind}
      />

      <Register
        visible={showRegister}
        onClose={() => {
          setShowRegister(false);
        }}
      />
    </Header>
  );
};

export default Header;
