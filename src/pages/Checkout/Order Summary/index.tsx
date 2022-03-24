import MainCard from '@components/Card/MainCard';
import { Col, Row, Space, Typography } from 'antd';
import { MdEdit } from 'react-icons/md';

const OrderSummary = () => {
  const { Title } = Typography;
  return (
    <MainCard>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>Order Summary</Title>
          </Col>

          <Col>
            <MdEdit size={20} />
          </Col>
        </Row>
      </Space>
    </MainCard>
  );
};

export default OrderSummary;
