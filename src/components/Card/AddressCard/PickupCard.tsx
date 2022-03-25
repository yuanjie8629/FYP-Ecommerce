import { Col, Row, Skeleton, Typography } from 'antd';
import { HiLocationMarker } from 'react-icons/hi';
import ColorCard, { ColorCardProps } from '../ColorCard';

interface PickupCardProps extends ColorCardProps {
  location?: string;
  loading?: boolean;
  extra?: React.ReactNode;
  showDefault?: boolean;
}

const PickupCard = ({
  location,
  loading,
  extra,
  showDefault = true,
  ...props
}: PickupCardProps) => {
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
        <Col span={18} style={{ textAlign: 'start' }}>
          {location ? (
            <Text strong>{location}</Text>
          ) : (
            <Skeleton paragraph={{ rows: 2 }} active={loading} />
          )}
        </Col>
        <Col span={3}>{extra}</Col>
      </Row>
    </ColorCard>
  );
};
export default PickupCard;
