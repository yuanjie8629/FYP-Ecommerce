import Button from '@components/Button';
import MainCard from '@components/Card/MainCard';
import {
  CardProps,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';

interface OrderShipmentInfo {
  contact_name: string;
  contact_num: string;
  address: string;
  state: string;
  city: string;
  postcode: string;
  track_num: string;
}

interface OrderPickupInfo {
  contact_name: string;
  contact_num: string;
  location: string;
  pickup_dt: string;
}

interface ShipmentInfoProps extends CardProps {
  shipment?: OrderShipmentInfo;
  pickup?: OrderPickupInfo;
  email?: string;
  loading?: boolean;
}

const ShipmentInfo = ({
  shipment,
  pickup,
  loading,
  ...props
}: ShipmentInfoProps) => {
  const { Text, Title } = Typography;

  return (
    <MainCard {...props}>
      <Space
        direction='vertical'
        size={20}
        style={{ textAlign: 'start' }}
        className='full-width'
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>
              {pickup ? 'Pickup Information' : 'Shipment Information'}
            </Title>
          </Col>
        </Row>
        {loading ? (
          <Skeleton
            active
            title={null}
            paragraph={{ rows: 6, width: '100%' }}
          />
        ) : pickup ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label='Contact Name'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {pickup?.contact_name}
            </Descriptions.Item>
            <Descriptions.Item
              label='Contact Number'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {pickup?.contact_num}
            </Descriptions.Item>
            <Descriptions.Item
              label='Location'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {pickup?.location}
            </Descriptions.Item>
            <Descriptions.Item
              label='Pickup Date'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {pickup.pickup_dt ? (
                pickup?.pickup_dt
              ) : (
                <Text type='danger'>
                  Please collect your order at the location selected.
                </Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label='Contact Name'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.contact_name}
            </Descriptions.Item>
            <Descriptions.Item
              label='Contact Number'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.contact_num}
            </Descriptions.Item>
            <Descriptions.Item
              label='Address'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.address}
            </Descriptions.Item>
            <Descriptions.Item
              label='State'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.state}
            </Descriptions.Item>
            <Descriptions.Item
              label='City'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.city}
            </Descriptions.Item>
            <Descriptions.Item
              label='Postcode'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.postcode}
            </Descriptions.Item>
            <Descriptions.Item
              label='Tracking Number'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {shipment?.track_num ? (
                <Button
                  type='link'
                  color='info'
                  onClick={() => {
                    window['linkTrack'](shipment?.track_num);
                  }}
                >
                  {shipment?.track_num}
                </Button>
              ) : (
                <Text type='secondary'>Pending</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Space>
    </MainCard>
  );
};

export default ShipmentInfo;
