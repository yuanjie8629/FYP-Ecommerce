import MainCard from '@components/Card/MainCard';
import { CardProps, Col, Row, Space, Typography } from 'antd';
import { MdEdit } from 'react-icons/md';

interface OrderSummaryProps extends CardProps {
  onCartClick?: () => void;
}

const OrderSummary = ({ onCartClick, ...props }: OrderSummaryProps) => {
  const { Title } = Typography;
  return (
    <MainCard>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>Order Summary</Title>
          </Col>

          <Col>
            <MdEdit
              size={20}
              onClick={() => {
                onCartClick();
              }}
            />
          </Col>
        </Row>
      </Space>
    </MainCard>
  );
};

export default OrderSummary;
