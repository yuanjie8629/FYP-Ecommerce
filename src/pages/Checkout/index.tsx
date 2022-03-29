import { cartDetailsAPI, cartDetailsForUserAPI } from '@api/services/cartAPI';
import { AddressInfo } from '@components/Card/AddressCard';
import Layout from '@components/Layout';
import { drawerOpenProps } from '@components/Layout/Header';
import PaymentModal from '@components/Modal/PaymentModal';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { findRoutePath } from '@utils/routingUtils';
import { getCartItem, getUserId, refreshCart } from '@utils/storageUtils';
import { Col, Row, Space } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from './Order Summary';
import Payment, { paymentMethodType } from './Payment';
import PlaceOrder from './PlaceOrder.tsx';
import ShippingAddress, { PickupInfo } from './ShippingAddress';
import Voucher from './Voucher';

const Checkout = () => {
  const [address, setAddress] = useState<AddressInfo>();
  const [pickup, setPickup] = useState<PickupInfo>();
  const [drawerOpen, setDrawerOpen] = useState<drawerOpenProps>();
  const [cart, setCart, cartPrice, setCartPrice] = useContext(CartContext);
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [voucher, setVoucher] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<paymentMethodType>();
  const [outOfStock, setOutofStock] = useState(false);
  const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (cart && cart.find((cartItem) => cartItem.stock <= 0)) {
      setOutofStock(true);
    } else {
      setOutofStock(false);
    }
  }, [cart, navigate]);

  useEffect(() => {
    setLoading(true);
    if (getUserId()) {
      console.log('Retrieving cart items...');
      cartDetailsForUserAPI(address?.state, voucher)
        .then((res) => {
          if (res.data?.items?.length <= 0) {
            navigate(findRoutePath('home'));
          }
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          if (res.data?.ship_fee) {
            setShippingFee(res.data?.ship_fee);
          }
          if (res.data?.discount) {
            if (res.data?.discount === 'no_stock')
              showVoucherErrMsg('Sorry, this voucher has been fully redeemed.');
            else if (res.data?.discount === 'invalid')
              showVoucherErrMsg('Sorry, this voucher is not valid.');
            else if (res.data?.discount === 'exceed_limit') {
              showVoucherErrMsg(
                'Sorry, you have reached the redemption limit on this voucher.'
              );
            } else if (res.data?.discount?.min_spend) {
              showVoucherErrMsg(
                `Sorry, the minimum spend to apply this voucher is RM${res.data?.discount?.min_spend}.`
              );
            } else {
              setDiscount(res.data?.discount);
            }
          } else {
            setDiscount(undefined);
          }

          setTotalPrice(res.data?.total_price);
          console.log('Retrieved cart items.');
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            if (err.response?.status === 404) {
              navigate(findRoutePath('home'));
              return;
            }
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
          if (res.data?.items?.length <= 0) {
            window.location.href = '';
          }
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
  }, [getUserId(), address, voucher]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showVoucherErrMsg = (message) => {
    messageApi.open({
      key: 'voucherErr',
      type: 'error',
      content: message,
    });
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
                  setPickup(undefined);
                }}
                onPickup={(location) => {
                  setPickup(location);
                  setAddress(undefined);
                }}
                onEdit={() => {
                  setAddress(undefined);
                  setPickup(undefined);
                }}
                onEmail={(email) => {
                  setEmail(email);
                }}
              />
              <Voucher
                cartPrice={cartPrice}
                onApplyVoucher={(code) => {
                  setVoucher(code);
                }}
              />
              <Payment
                onPaymentSelect={(paymentMethod) => {
                  setPaymentMethod(paymentMethod);
                }}
              />
            </Space>
          </Col>
          <Col xs={24} xl={12}>
            <div>
              <OrderSummary
                cart={cart}
                total={totalPrice}
                subTotal={cartPrice}
                shipping={shippingFee}
                discount={discount}
                voucher={voucher}
                loading={loading}
                oos={outOfStock}
                onCartClick={() => {
                  setDrawerOpen({ drawer: 'cart', from: 'orderSummary' });
                }}
                pickup={pickup !== undefined}
              />
            </div>
          </Col>
          <Col xs={24} xl={12}>
            <PlaceOrder
              loading={loading}
              cart={cart}
              totalPrice={totalPrice}
              address={address}
              pickup={pickup}
              voucher={voucher}
              paymentMethod={paymentMethod}
              oos={outOfStock}
              email={email}
              resetCart={() => {
                setCart([]);
              }}
              onPaymentRedirect={(load) => {
                setShowPaymentRedirect(load);
              }}
            />
          </Col>
        </Row>
      </Space>
      <PaymentModal visible={showPaymentRedirect} />
    </Layout>
  );
};

export default Checkout;
