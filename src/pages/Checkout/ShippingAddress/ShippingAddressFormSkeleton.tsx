import { Col, Row, Skeleton, Space } from 'antd';

const ShippingAddressFormSkeleton = () => {
  return (
    <Space direction='vertical' className='full-width'>
      <Skeleton active title={false} paragraph={{ width: '100%', rows: 10 }} />
      <Row justify='end'>
        <Col>
          <Skeleton.Button />
        </Col>
      </Row>
    </Space>
  );
};

export default ShippingAddressFormSkeleton;
