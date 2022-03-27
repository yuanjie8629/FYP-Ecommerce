import { Col, Row, Typography } from 'antd';
import FPXicon from '@assets/Payment/fpx.png';
import PaymentCard, { PaymentCardProps } from '.';

const OnlinePaymentCard = (props: PaymentCardProps) => {
  const { Text } = Typography;
  return (
    <PaymentCard hoverable style={{ border: '1px solid #e5e7eb' }} {...props}>
      <Row gutter={20} align='middle'>
        <Col span={3}>
          <img src={FPXicon} alt='fpx' width={40} />
        </Col>
        <Col>
          <Text strong>Online Banking</Text>
        </Col>
      </Row>
    </PaymentCard>
  );
};

export default OnlinePaymentCard;
