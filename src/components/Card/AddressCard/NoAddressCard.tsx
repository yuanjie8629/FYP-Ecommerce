import { Col, Row, Typography } from 'antd';
import { HiLocationMarker } from 'react-icons/hi';
import ColorCard, { ColorCardProps } from '../ColorCard';

interface NoAddressCardProps extends ColorCardProps {}

const NoAddressCard = (props: NoAddressCardProps) => {
  const { Text } = Typography;
  return (
    <ColorCard
      backgroundColor='grey'
      bodyStyle={{ padding: 20 }}
      className='full-width'
      {...props}
    >
      <Row>
        <Col span={3}>
          <HiLocationMarker size={20} className='color-primary' />
        </Col>
        <Col span={21} style={{ textAlign: 'start' }}>
          <Text strong>No Address Found</Text>
        </Col>
      </Row>
    </ColorCard>
  );
};
export default NoAddressCard;
