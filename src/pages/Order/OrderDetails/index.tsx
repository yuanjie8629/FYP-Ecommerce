import { orderDetailsAPI, orderSearchAPI } from '@api/services/orderAPI';
import Layout from '@components/Layout';
import PaymentModal from '@components/Modal/PaymentModal';
import { MessageContext } from '@contexts/MessageContext';
import Payment, { paymentMethodType } from '@pages/Checkout/Payment';
import { serverErrMsg } from '@utils/messageUtils';
import { findRoutePath } from '@utils/routingUtils';
import { Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import OrderInfo from './OrderInfo';
import OrderItems from './OrderItems';
import OrderStatus from './OrderStatus';
import PayButton from './PayButton';
import ShipmentInfo from './ShipmentInfo';

const OrderDetails = () => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [paymentMethod, setPaymentMethod] = useState<paymentMethodType>();
  const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.has('email')) {
      setLoading(true);
      orderSearchAPI(searchParams.get('email'), id).catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.status === 404) {
            navigate(findRoutePath('home'));
            return;
          }
          showServerErrMsg();
        }
      });
    } else {
      navigate(findRoutePath('home'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, searchParams]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    orderDetailsAPI(id)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          style={{
            marginTop: 50,
            width: screens.md ? 800 : '90%',
          }}
          size={30}
          className='full-width'
        >
          <div style={{ textAlign: 'center' }}>
            <Title level={screens.md ? 3 : 4}>Order History</Title>
          </div>
          <OrderInfo
            id={data['id']}
            date={data['date']}
            status={data['status']}
            email={data['email']}
            loading={loading}
          />
          {screens.md && (
            <OrderStatus
              shipmentType={data['shipment'] ? 'shipping' : 'pickup'}
              status={data['status']}
              loading={loading}
            />
          )}
          <ShipmentInfo
            shipment={{
              contact_name: data['shipment']?.contact_name,
              contact_num: data['shipment']?.contact_num,
              address: data['shipment']?.address,
              state: data['shipment']?.postcode?.state,
              city: data['shipment']?.postcode?.city,
              postcode: data['shipment']?.postcode?.postcode,
              track_num: data['shipment']?.track_num,
            }}
            pickup={data['pickup']}
            loading={loading}
          />
          <OrderItems
            loading={loading}
            items={data['item']}
            subTotal={data['subtotal']}
            total={data['total_amt']}
            discount={data['discount']}
            voucher={data['voucher']}
            shipping={data['shipment']?.ship_fee}
            pickup={data['pickup']}
          />
          {data['status'] === 'unpaid' && (
            <>
              <Payment
                onPaymentSelect={(payment) => {
                  setPaymentMethod(payment);
                }}
              />
              <PayButton
                orderId={data['id']}
                totalAmt={data['total_amt']}
                paymentMethod={paymentMethod}
                onPaymentRedirect={(load) => {
                  setShowPaymentRedirect(load);
                }}
              />
            </>
          )}
        </Space>
      </Row>
      <PaymentModal visible={showPaymentRedirect} />
    </Layout>
  );
};

export default OrderDetails;
