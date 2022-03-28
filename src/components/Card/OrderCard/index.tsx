import { Col, Row, Skeleton, Space, Tag, Typography } from 'antd';
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
        <Col span={18} style={{ textAlign: 'start' }}>
          {address ? (
            <Space direction='vertical'>
              <Text strong>{address.contact_name}</Text>
              <Text type='secondary'>{address.contact_num}</Text>
              <Text>{address.address}</Text>
              <Text>{`${address.state}, ${address.city}, ${address.postcode}`}</Text>
              {address.default && showDefault && (
                <Tag color='success'>Default</Tag>
              )}
            </Space>
          ) : (
            <Skeleton paragraph={{ rows: 2 }} active={loading} />
          )}
        </Col>
      </Row>
    </ColorCard>
  );
};
export default AddressCard;
