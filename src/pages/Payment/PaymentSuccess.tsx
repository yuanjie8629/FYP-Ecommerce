import Button from '@components/Button';
import Layout from '@components/Layout';
import { findRoutePath } from '@utils/routingUtils';
import { getUserId } from '@utils/storageUtils';
import { Result } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchParams.has('session_id')) {
      navigate(findRoutePath('home'));
    }
  }, [navigate, searchParams]);

  const extraBtn = getUserId()
    ? [
        <Button
          onClick={() => {
            navigate(findRoutePath('home'));
          }}
        >
          Continue Shopping
        </Button>,
        <Button
          type='primary'
          onClick={() => {
            navigate(findRoutePath('orderHistory'));
          }}
        >
          View Order
        </Button>,
      ]
    : [
        <Button
          type='primary'
          onClick={() => {
            navigate(findRoutePath('home'));
          }}
        >
          Got it
        </Button>,
      ];

  return (
    <Layout>
      <Result
        status='success'
        title='Order Confirmed!'
        subTitle='Your order is confirmed. You will receive an order confirmation emil shortly.'
        extra={extraBtn}
      />
    </Layout>
  );
};

export default PaymentSuccess;
