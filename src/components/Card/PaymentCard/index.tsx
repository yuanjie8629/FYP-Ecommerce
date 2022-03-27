import { Card, CardProps, Col, Row } from 'antd';
import { HiCheckCircle } from 'react-icons/hi';
import '../ColorCard/ColorCard.less';

export interface PaymentCardProps extends CardProps {
  selected?: boolean;
}

const PaymentCard = ({ selected, className, ...props }: PaymentCardProps) => {
  return (
    <Card
      className={`${selected ? 'small-card-success' : ''}${
        className ? ` ${className}` : ''
      }`}
      {...props}
    >
      <Row gutter={20} align='middle'>
        <Col span={22}>{props.children}</Col>
        {selected && (
          <Col span={2}>
            <HiCheckCircle size={20} className='color-primary' />
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default PaymentCard;
