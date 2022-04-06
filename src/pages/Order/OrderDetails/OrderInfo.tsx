import MainCard from '@components/Card/MainCard';
import { orderStatList } from '@utils/optionUtils';
import {
  CardProps,
  Col,
  Descriptions,
  Grid,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';

interface OrderInfoProps extends CardProps {
  id?: string;
  date?: string;
  email?: string;
  status?: string;
  loading?: boolean;
}

const OrderInfo = ({
  id,
  date,
  status,
  loading,
  email,
  ...props
}: OrderInfoProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

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
            <Title level={5}>Order Information</Title>
          </Col>
        </Row>
        {loading ? (
          <Skeleton
            active
            title={null}
            paragraph={{ rows: 4, width: '100%' }}
          />
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label='Order Number'
              span={12}
              style={{ fontWeight: 600 }}
            >
              #{id}
            </Descriptions.Item>
            <Descriptions.Item
              label='Order Date'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {date}
            </Descriptions.Item>
            <Descriptions.Item
              label='Contact Email'
              span={12}
              style={{ fontWeight: 600 }}
            >
              {email}
            </Descriptions.Item>
            {!screens.md && (
              <Descriptions.Item
                label='Order Status'
                span={12}
                style={{ fontWeight: 600 }}
              >
                <Text
                  strong
                  className={`color-${
                    orderStatList.find(
                      (orderStat) => orderStat.status === status
                    )?.color
                  }`}
                >
                  {
                    orderStatList.find(
                      (orderStat) => orderStat.status === status
                    )?.label
                  }
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Space>
    </MainCard>
  );
};

export default OrderInfo;
