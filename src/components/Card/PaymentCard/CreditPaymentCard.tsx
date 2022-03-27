import { Col, Row, Typography } from 'antd';
import { HiCreditCard } from 'react-icons/hi';
import PaymentCard, { PaymentCardProps } from '.';

const CreditPaymentCard = (props: PaymentCardProps) => {
  const { Text } = Typography;
  return (
    <PaymentCard hoverable style={{ border: '1px solid #e5e7eb' }} {...props}>
      <Row gutter={20} align='middle'>
        <Col span={3}>
          <HiCreditCard size={30} className='color-grey' />
        </Col>
        <Col>
          <Text strong>Credit / Debit Card</Text>
        </Col>
      </Row>
    </PaymentCard>
  );
};

export default CreditPaymentCard;
