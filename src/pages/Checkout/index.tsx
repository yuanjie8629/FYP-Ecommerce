import { addressDefaultAPI } from '@api/services/addressAPI';
import { cartDetailsAPI, cartDetailsForUserAPI } from '@api/services/cartAPI';
import { itemPrevByIdsAPI } from '@api/services/productAPI';
import Button from '@components/Button';
import AddressCard, { AddressInfo } from '@components/Card/AddressCard';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import { drawerOpenProps, drawerProps } from '@components/Layout/Header';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getCartItem, getUserId, refreshCart } from '@utils/storageUtils';
import { Col, Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import OrderSummary from './Order Summary';
import ShippingAddress from './ShippingAddress';
import Voucher from './Voucher';

const Checkout = () => {
  const { Text, Title } = Typography;
  const [address, setAddress] = useState<AddressInfo>();
  const [pickup, setPickup] = useState('');
  const [drawerOpen, setDrawerOpen] = useState<drawerOpenProps>();
  const [cart, setCart, cartPrice, setCartPrice] = useContext(CartContext);
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>();
  const [totalPrice, setTotalPrice] = useState<number>();

  useEffect(() => {
    setLoading(true);
    if (getUserId()) {
      console.log('Retrieving cart items...');
      cartDetailsForUserAPI(address?.state)
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          if (res.data?.ship_fee) {
            setShippingFee(res.data?.ship_fee);
          }
          setTotalPrice(res.data?.total_price);
          console.log('Retrieved cart items.');
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
          }
        });
    } else if (getCartItem()) {
      console.log('Retrieving cart items...');
      cartDetailsAPI(
        getCartItem().map((item) => {
          return { id: item.id, quantity: item.quantity };
        }),
        address?.state
      )
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          if (res.data?.ship_fee) {
            setShippingFee(res.data?.ship_fee);
          }
          setTotalPrice(res.data?.total_price);
          refreshCart(res.data?.items);
          console.log('Retrieved cart items.');
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserId(), address]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Layout
      drawerOpen={drawerOpen}
      onDrawerClose={() => {
        setDrawerOpen(undefined);
      }}
    >
      <Space
        direction='vertical'
        size={20}
        className='full-width'
        style={{ padding: 20 }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <Space direction='vertical' size={20} className='full-width'>
              <ShippingAddress
                onSave={(address) => {
                  setAddress(address);
                  setPickup('');
                }}
                onPickup={(location) => {
                  setPickup(location);
                  setAddress(undefined);
                }}
              />
              <Voucher />
            </Space>
          </Col>
          <Col xs={24} xl={12}>
            <div>
              <OrderSummary
                cart={cart}
                total={totalPrice}
                subTotal={cartPrice}
                shipping={shippingFee}
                loading={loading}
                onCartClick={() => {
                  setDrawerOpen({ drawer: 'cart', from: 'orderSummary' });
                }}
                pickup={pickup !== ''}
              />
            </div>
          </Col>
        </Row>
      </Space>
    </Layout>
  );
};

export default Checkout;
