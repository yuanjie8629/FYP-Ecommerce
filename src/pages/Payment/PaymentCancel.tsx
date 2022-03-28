import Button from '@components/Button';
import Layout from '@components/Layout';
import { findRoutePath } from '@utils/routingUtils';
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Result
        status='error'
        title='Payment Failed'
        subTitle='Your payment could not be proceed. Please Try Again.'
        extra={[
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
        ]}
      />
    </Layout>
  );
};

export default PaymentCancel;
