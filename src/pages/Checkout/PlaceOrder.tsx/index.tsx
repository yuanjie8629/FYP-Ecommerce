import { placeOrderAPI } from '@api/services/orderAPI';
import Button from '@components/Button';
import { AddressInfo } from '@components/Card/AddressCard';
import MainCard from '@components/Card/MainCard';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { CardProps, Col, Row, Space, Typography } from 'antd';
import { useContext, useState } from 'react';
import { paymentMethodType } from '../Payment';

interface PlaceOrderProps extends CardProps {
  loading?: boolean;
  cart?: any[];
  totalPrice?: number;
  address?: AddressInfo;
  pickup?: string;
  voucher?: string;
  paymentMethod?: paymentMethodType;
  oos?: boolean;
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
  ...props
}: PlaceOrderProps) => {
  const { Text } = Typography;
  const [messageApi] = useContext(MessageContext);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handlePlaceOrder = () => {
    let addressInfo = undefined;
    if (address) {
      let { contactName, contactNum, ...addressData } = address;
      addressData['contact_name'] = contactName;
      addressData['contact_num'] = contactNum;
      addressInfo = addressData;
    }

    setSubmitLoading(true);
    placeOrderAPI(
      cart.map((cartItem) => {
        return { item: cartItem.id, quantity: cartItem.quantity };
      }),
      voucher,
      addressInfo,
      pickup
    )
      .then((res) => {
        console.log(res.data);
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
      <Row justify='space-between' align='middle'>
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
        <Col>
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
