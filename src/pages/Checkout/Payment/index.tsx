import MainCard from '@components/Card/MainCard';
import CreditPaymentCard from '@components/Card/PaymentCard/CreditPaymentCard';
import OnlinePaymentCard from '@components/Card/PaymentCard/OnlinePaymentCard';
import { CardProps, Space, Typography } from 'antd';
import { useState } from 'react';

export type paymentMethodType = 'card' | 'fpx' | undefined;

interface PaymentProps extends CardProps {
  onPaymentSelect?: (paymentMethod: paymentMethodType) => void;
}

const Payment = ({ onPaymentSelect = () => null, ...props }: PaymentProps) => {
  const { Title } = Typography;
  const [paymentMethod, setPaymentMethod] = useState<paymentMethodType>();

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Title level={5}>Payment</Title>
        <CreditPaymentCard
          selected={paymentMethod === 'card'}
          onClick={() => {
            setPaymentMethod('card');
            onPaymentSelect('card');
          }}
        />
        <OnlinePaymentCard
          selected={paymentMethod === 'fpx'}
          onClick={() => {
            setPaymentMethod('fpx');
            onPaymentSelect('fpx');
          }}
        />
      </Space>
    </MainCard>
  );
};

export default Payment;
