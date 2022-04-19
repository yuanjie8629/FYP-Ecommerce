import MainCard from '@components/Card/MainCard';
import {
  Alert,
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
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface OrderSummaryProps extends CardProps {
  loading?: boolean;
  cart?: any[];
  subTotal?: number;
  discount?: number;
  voucher?: string;
  shipping?: number;
  total?: number;
  pickup?: boolean;
  oos?: boolean;
  onCartClick?: () => void;
}

const OrderSummary = ({
  loading,
  cart,
  subTotal,
  total,
  discount = 0,
  voucher,
  shipping = 0,
  pickup,
  oos,
  onCartClick,
  ...props
}: OrderSummaryProps) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [load, setLoad] = useState(0);

  useEffect(() => {
    if (loading) {
      setLoad(load + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const ListItem = (item) => (
    <List.Item>
      <Row justify='space-between' className='full-width'>
        <Col xs={18}>
          <Space align='start' className='full-width'>
            <img
              src={item.thumbnail}
              alt={item.id}
              width={screens.md ? 124 : 70}
              style={{ border: '1px solid #e5e7eb' }}
            />
            <Space direction='vertical' size={10} className='full-width'>
              <div className='text-button-wrapper'>
                <Text
                  strong
                  onClick={() => {
                    if (item.stock > 0) {
                      navigate(`/item/${item.id}`);
                    }
                  }}
                  className={`text-button${screens.md ? ' text-lg' : ''}`}
                >
                  {item.name}
                </Text>
              </div>
              <Space size={10} className='full-width'>
                <Text type='secondary'>{screens.sm ? 'Quantity' : 'Qty'}:</Text>
                <Text strong className={`${screens.md ? 'text-lg' : ''}`}>
                  {item.quantity}
                </Text>
              </Space>
              {item.stock <= 0 && (
                <Text strong type='danger'>
                  Out of Stock
                </Text>
              )}
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

          <Col>
            <MdEdit
              size={20}
              onClick={() => {
                onCartClick();
              }}
              style={{ cursor: 'pointer' }}
            />
          </Col>
        </Row>
        {oos && !loading && (
          <Alert
            showIcon
            type='error'
            message={
              <Text type='danger'>Please remove out of stock items.</Text>
            }
          />
        )}
        <Divider style={{ margin: 0 }} />
        {loading && load <= 1 ? (
          <Skeleton
            active
            avatar={{ shape: 'square', size: screens.md ? 124 : 70 }}
            paragraph={{ rows: 2 }}
          />
        ) : (
          <List dataSource={cart} renderItem={ListItem} />
        )}

        <Divider style={{ margin: 0 }} />
        <div>
          <Row justify='space-between' style={{ margin: '15px 0' }}>
            <Col>
              <Text className='text-lg'>Subtotal</Text>
            </Col>
            <Col>
              <Text strong className='text-lg'>
                {loading ? 'Calculating...' : `RM ${subTotal}`}
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
                {loading ? (
                  <Text strong className='text-lg'>
                    Calculating...
                  </Text>
                ) : shipping ? (
                  <Text strong className='text-lg'>
                    RM {shipping}
                  </Text>
                ) : screens.sm ? (
                  <Text type='secondary' className='text-sm'>
                    Please confirm your shipping address.
                  </Text>
                ) : (
                  <Text type='secondary' className='text-sm'>
                    Confirm shipping address.
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
                  {loading ? 'Calculating...' : `- RM ${discount}`}
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
                {loading || !total ? 'Calculating...' : `RM ${total}`}
              </Text>
            </Col>
          </Row>
        </div>
      </Space>
    </MainCard>
  );
};

export default OrderSummary;
