import { orderStatList } from '@utils/optionUtils';
import { Col, Grid, Row, Skeleton, Space, Tag, Typography } from 'antd';
import { MdLocalShipping, MdStore } from 'react-icons/md';
import ColorCard, { ColorCardProps } from '../ColorCard';

export type ShipmentType = 'shipping' | 'pickup';

export interface OrderInfo {
  id: string;
  date: string;
  email: string;
  status: string;
  total_amt: string;
  shipment: ShipmentType;
}

interface OrderCardProps extends ColorCardProps {
  order?: OrderInfo;
  loading?: boolean;
  extra?: React.ReactNode;
}

const OrderCard = ({ loading, order, extra, ...props }: OrderCardProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <ColorCard
      hoverable
      backgroundColor='grey'
      className='full-width'
      {...props}
    >
      <Row>
        <Col span={24} style={{ textAlign: 'start' }}>
          {order ? (
            <Space direction='vertical' className='full-width'>
              <Row gutter={[10, 10]} justify='space-between' align='middle'>
                <Col>
                  {order.shipment !== 'pickup' ? (
                    <Space size={10}>
                      <MdLocalShipping
                        size={screens.md ? 50 : 30}
                        className={`${
                          order.status !== 'completed'
                            ? 'color-grey'
                            : 'color-primary'
                        }`}
                      />
                      {screens.md ? (
                        <Title
                          level={5}
                          className={`${
                            order.status !== 'completed'
                              ? 'color-grey'
                              : 'color-primary'
                          }`}
                        >
                          Shipment Order
                        </Title>
                      ) : (
                        <Text
                          strong
                          className={`text-lg${
                            order.status !== 'completed'
                              ? ' color-grey'
                              : ' color-primary'
                          }`}
                        >
                          Shipment Order
                        </Text>
                      )}
                    </Space>
                  ) : (
                    <Space size={10}>
                      <MdStore
                        size={screens.md ? 50 : 30}
                        className={`${
                          order.status !== 'completed'
                            ? 'color-grey'
                            : 'color-primary'
                        }`}
                      />
                      {screens.md ? (
                        <Title
                          level={5}
                          className={`${
                            order.status !== 'completed'
                              ? 'color-grey'
                              : 'color-primary'
                          }`}
                        >
                          Pickup Order
                        </Title>
                      ) : (
                        <Text
                          strong
                          className={`text-lg${
                            order.status !== 'completed'
                              ? ' color-grey'
                              : ' color-primary'
                          }`}
                        >
                          Pickup Order
                        </Text>
                      )}
                    </Space>
                  )}
                </Col>
                <Col>
                  <Tag
                    color={
                      orderStatList.find(
                        (orderStat) => orderStat.status === order.status
                      ).color
                    }
                    style={{ margin: 0 }}
                  >
                    {
                      orderStatList.find(
                        (orderStat) => orderStat.status === order.status
                      ).label
                    }
                  </Tag>
                </Col>
              </Row>
              <Row gutter={[10, 10]} justify='space-between'>
                <Col>
                  <Text strong className={`${screens.md ? 'text-lg' : ''}`}>
                    #{order.id}
                  </Text>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                  <Text strong className={`${screens.md ? 'text-lg' : ''}`}>
                    RM {order.total_amt}
                  </Text>
                </Col>
              </Row>
              <Text
                type='secondary'
                className={`${screens.md ? '' : 'text-sm'}`}
              >
                {order.date}
              </Text>
            </Space>
          ) : (
            <Skeleton paragraph={{ rows: 2 }} active={loading} />
          )}
        </Col>
      </Row>
    </ColorCard>
  );
};
export default OrderCard;
