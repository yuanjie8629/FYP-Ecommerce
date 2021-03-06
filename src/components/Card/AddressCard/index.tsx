import { Col, Row, Skeleton, Space, Tag, Typography } from 'antd';
import { HiLocationMarker } from 'react-icons/hi';
import ColorCard, { ColorCardProps } from '../ColorCard';

export interface AddressInfo {
  contact_name: string;
  contact_num: string;
  address: string;
  state: string;
  city: string;
  postcode: string;
  default: boolean;
}

interface AddressCardProps extends ColorCardProps {
  address?: AddressInfo;
  loading?: boolean;
  extra?: React.ReactNode;
  showDefault?: boolean;
}

const AddressCard = ({
  loading,
  address,
  extra,
  showDefault = true,
  ...props
}: AddressCardProps) => {
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
          {address ? (
            <Space direction='vertical'>
              <Text strong>{address.contact_name}</Text>
              <Text type='secondary'>{address.contact_num}</Text>
              <Text>{address.address}</Text>
              <Text>{`${address.postcode}, ${address.city}, ${address.state}.`}</Text>
              {address.default && showDefault && (
                <Tag color='success'>Default</Tag>
              )}
            </Space>
          ) : (
            <Skeleton paragraph={{ rows: 2 }} active={loading} />
          )}
        </Col>
        <Col span={3}>{extra}</Col>
      </Row>
    </ColorCard>
  );
};
export default AddressCard;
