import MainCard from '@components/Card/MainCard';
import {
  CardProps,
  Col,
  Divider,
  Grid,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';

interface OrderSummaryProps extends CardProps {
  loading?: boolean;
  items?: any[];
  subTotal?: number;
  discount?: number;
  voucher?: string;
  shipping?: number;
  total?: number;
  pickup?: boolean;
}

const OrderItems = ({
  loading,
  items,
  subTotal,
  total,
  discount = 0,
  voucher,
  shipping = 0,
  pickup,
  ...props
}: OrderSummaryProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const ListItem = (item) => (
    <List.Item>
      <Row justify='space-between' className='full-width'>
        <Col xs={16}>
          <Space align='start' className='full-width'>
            <img
              src={item.thumbnail}
              alt={item.id}
              width={screens.md ? 124 : 70}
              style={{ border: '1px solid #e5e7eb' }}
            />
            <Space
              direction='vertical'
              size={10}
              className='full-width'
              style={{ textAlign: 'start' }}
            >
              <Text strong className={`${screens.md ? ' text-lg' : ''}`}>
                {item.name}
              </Text>
              <Space size={10} className='full-width'>
                <Text type='secondary'>{screens.sm ? 'Quantity' : 'Qty'}:</Text>
                <Text strong className={`${screens.md ? 'text-lg' : ''}`}>
                  {item.quantity}
                </Text>
              </Space>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space
            direction='vertical'
            size={0}
            className='full-width'
            style={{ textAlign: 'end' }}
          >
            <Text
              type={item.special_price ? 'secondary' : undefined}
              strong
              className={`${screens.md ? 'text-lg' : ''}`}
              delete={item.special_price}
            >
              RM {item.price}
            </Text>
            {item.special_price && (
              <Text
                strong
                className={`color-primary${screens.md ? ' text-lg' : ''}`}
              >
                RM {item.special_price}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <MainCard>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>Order Summary</Title>
          </Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        {loading ? (
          <Skeleton
            active
            avatar={{ shape: 'square', size: screens.md ? 124 : 70 }}
            paragraph={{ rows: 2 }}
          />
        ) : (
          <List dataSource={items} renderItem={ListItem} />
        )}

        <Divider style={{ margin: 0 }} />
        <div>
          <Row justify='space-between' style={{ margin: '15px 0' }}>
            <Col>
              <Text className='text-lg'>Subtotal</Text>
            </Col>
            <Col>
              <Text strong className='text-lg'>
                {loading || !subTotal ? 'Loading...' : `RM ${subTotal}`}
              </Text>
            </Col>
          </Row>
          {!pickup && (
            <Row
              justify='space-between'
              align='bottom'
              style={{ margin: '15px 0' }}
            >
              <Col>
                <Text className='text-lg'>Shipping</Text>
              </Col>
              <Col>
                {loading || !shipping ? (
                  <Text strong className='text-lg'>
                    Loading...
                  </Text>
                ) : (
                  <Text strong className='text-lg'>
                    RM {shipping}
                  </Text>
                )}
              </Col>
            </Row>
          )}
          {discount > 0 && (
            <Row justify='space-between' style={{ margin: '15px 0' }}>
              <Col>
                <Text className='text-lg'>
                  Discount {voucher ? `(${voucher})` : ''}
                </Text>
              </Col>
              <Col>
                <Text strong className='text-lg'>
                  {loading || !discount ? 'Loading...' : `- RM ${discount}`}
                </Text>
              </Col>
            </Row>
          )}
          <Divider style={{ margin: 0 }} />
          <Row justify='space-between' style={{ margin: '15px 0' }}>
            <Col>
              <Text strong className='text-lg color-primary'>
                Total
              </Text>
            </Col>
            <Col>
              <Text strong className='text-lg color-primary'>
                {loading || !total ? 'Loading...' : `RM ${total}`}
              </Text>
            </Col>
          </Row>
        </div>
      </Space>
    </MainCard>
  );
};

export default OrderItems;
