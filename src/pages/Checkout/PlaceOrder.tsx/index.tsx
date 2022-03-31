import { placeOrderAPI } from '@api/services/orderAPI';
import { createPaymentSessionAPI } from '@api/services/paymentAPI';
import Button from '@components/Button';
import { AddressInfo } from '@components/Card/AddressCard';
import MainCard from '@components/Card/MainCard';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { findRoutePath } from '@utils/routingUtils';
import { clearCart } from '@utils/storageUtils';
import { CardProps, Col, Row, Space, Typography } from 'antd';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentMethodType } from '../Payment';
import { PickupInfo } from '../ShippingAddress';

interface PlaceOrderProps extends CardProps {
  loading?: boolean;
  cart?: any[];
  totalPrice?: number;
  address?: AddressInfo;
  pickup?: PickupInfo;
  voucher?: string;
  paymentMethod?: paymentMethodType;
  oos?: boolean;
  email?: string;
  resetCart?: () => void;
  onPaymentRedirect?: (load: boolean) => void;
}

const PlaceOrder = ({
  loading,
  cart,
  totalPrice,
  address,
  pickup,
  voucher,
  paymentMethod,
  oos,
  email,
  resetCart = () => null,
  onPaymentRedirect = () => null,
  ...props
}: PlaceOrderProps) => {
  const { Text } = Typography;
  const [messageApi] = useContext(MessageContext);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    setSubmitLoading(true);
    placeOrderAPI(
      cart.map((cartItem) => {
        return { item: cartItem.id, quantity: cartItem.quantity };
      }),
      voucher,
      address,
      pickup,
      email
    )
      .then(async (res) => {
        onPaymentRedirect(true);
        await createPaymentSessionAPI(
          parseFloat(res.data?.total_amt),
          paymentMethod,
          res.data?.id
        )
          .then((res) => {
            if (res.data?.url) {
              window.open(res.data?.url, '_self');
            }
          })
          .catch((err) => {
            navigate(findRoutePath('paymentCancel'));
          });
        setSubmitLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (
            err.response?.status === 400 &&
            err.response?.data?.detail === 'no_stock'
          ) {
            showNoStockMsg();
            setSubmitLoading(false);
            return;
          }
          showServerErrMsg();
          setSubmitLoading(false);
        }
      })
      .finally(() => {
        clearCart();
        resetCart();
        onPaymentRedirect(false);
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showNoStockMsg = () => {
    messageApi.open({
      key: 'no_stock',
      type: 'error',
      content:
        'Some items in your order are out of stock. Please refresh the page.',
    });
  };

  return (
    <MainCard bodyStyle={{ padding: 15 }} {...props}>
      <Row gutter={[10, 10]} justify='space-between' align='middle'>
        {!(paymentMethod && (address || pickup)) ? (
          <Col>
            <Space direction='vertical'>
              {!(address || pickup) && (
                <Text strong type='danger' >
                  Please confirm your shipping address.
                </Text>
              )}
              {!paymentMethod && (
                <Text strong type='danger'>
                  Please select one payment method.
                </Text>
              )}
            </Space>
          </Col>
        ) : (
          <Col>
            <Space direction='vertical' size={0}>
              <Text strong>Total Payment</Text>
              {loading ? (
                <Text strong className='text-lg'>
                  Calculating...
                </Text>
              ) : (
                totalPrice && (
                  <Text strong className='color-primary text-lg'>
                    RM {totalPrice}
                  </Text>
                )
              )}
            </Space>
          </Col>
        )}
        <Col xs={24} sm={6} className='justify-end'>
          <Button
            type='primary'
            size='large'
            disabled={
              !(paymentMethod && totalPrice && (address || pickup)) ||
              loading ||
              oos
            }
            color={
              !(paymentMethod && totalPrice && (address || pickup)) ||
              loading ||
              oos
                ? 'grey'
                : undefined
            }
            loading={submitLoading}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Col>
      </Row>
    </MainCard>
  );
};
export default PlaceOrder;
