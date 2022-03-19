import Button from '@components/Button';
import { findRoutePath } from '@utils/routingUtils';
import {
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Col,
  ConfigProvider,
  Drawer,
  DrawerProps,
  Grid,
  InputNumber,
  List,
  message,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { addItemToCart } from '@utils/storageUtils';
import {
  cartAddAPI,
  cartRemoveAPI,
  cartSetQuantityAPI,
} from '@api/services/cartAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { AppContext } from '@contexts/AppContext';
import { MessageContext } from '@contexts/MessageContext';

interface CartProps extends DrawerProps {
  onDrawerHide?: () => void;
}

const Cart = ({ onDrawerHide = () => null, ...props }: CartProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useContext(AppContext);
  const [cartLoading, setCartLoading] = useState<number>();
  const [messageApi] = useContext(MessageContext);
  const [cartValue, setCartValue] = useState<number>();

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const handleCartAdd = (item) => {
    setCartLoading(item.id);
    cartAddAPI(item.id, 1)
      .then((res) => {
        setCart(res.data.items);
        setCartLoading(undefined);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
          setCartLoading(undefined);
        }
      });
  };

  const handleCartSet = (item, value) => {
    setCartLoading(item.id);
    cartSetQuantityAPI(item.id, value)
      .then((res) => {
        setCart(res.data.items);
        setCartLoading(undefined);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
          setCartLoading(undefined);
        }
      });
  };

  const handleCartMinus = (item) => {
    setCartLoading(item.id);
    cartRemoveAPI(item.id, 1)
      .then((res) => {
        setCart(res.data.items);
        setCartLoading(undefined);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
          setCartLoading(undefined);
        }
      });
  };

  const ListItem = (item) => (
    <List.Item>
      <Spin
        spinning={item.id === cartLoading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
      >
        <Row gutter={15}>
          <Col xs={6} md={7}>
            <img
              src={item.thumbnail}
              alt={item.id}
              width='100%'
              style={{ border: '1px solid #e5e7eb' }}
            />
          </Col>
          <Col xs={18} md={17}>
            <Space direction='vertical' size={10} className='full-width'>
              <Title level={5}>{item.name}</Title>
              {item.stock > 10 ? (
                <Text strong className='color-primary'>
                  In Stock
                </Text>
              ) : item.stock < 10 && item.stock > 0 ? (
                <Text strong type='warning'>
                  Low Stock
                </Text>
              ) : (
                <Text strong type='danger'>
                  Out of Stock
                </Text>
              )}
              <Row
                justify='space-between'
                align='middle'
                className='full-width'
              >
                <Col>
                  <Space size={10}>
                    {item.quantity > 1 ? (
                      <Button
                        icon={
                          <MinusOutlined
                            className='color-grey'
                            onClick={() => {
                              handleCartMinus(item);
                            }}
                          />
                        }
                      />
                    ) : (
                      <Button
                        color='error'
                        icon={
                          <DeleteOutlined
                            className='color-error'
                            onClick={() => {
                              handleCartMinus(item);
                            }}
                          />
                        }
                        style={{ border: '1px solid #f05252' }}
                      />
                    )}

                    <InputNumber
                      style={{ width: 50 }}
                      value={
                        cartValue !== undefined ? cartValue : item.quantity
                      }
                      onChange={(value) => {
                        setCartValue(value);
                      }}
                      onBlur={() => {
                        handleCartSet(item, cartValue);
                      }}
                    />

                    <Button
                      disabled={item.quantity >= item.stock}
                      icon={
                        <PlusOutlined
                          className='color-grey'
                          onClick={() => {
                            handleCartAdd(item);
                          }}
                        />
                      }
                    />
                  </Space>
                </Col>
                <Col>
                  {item.special_price && (
                    <Text strong className='text-lg color-primary'>
                      RM {item.price}
                    </Text>
                  )}
                  <Text strong className='text-lg' delete={item.special_price}>
                    RM {item.price}
                  </Text>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Spin>
    </List.Item>
  );
  return (
    <Drawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' className='full-width'>
        <Row
          align='bottom'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                onDrawerHide();
              }}
            />
          </Col>
          <Col span={23} style={{ textAlign: 'center' }}>
            <Title level={5}>Shopping Cart</Title>
          </Col>
        </Row>
        <ConfigProvider
          renderEmpty={() => (
            <Text type='secondary' className='text-lg'>
              There are no items in your cart.
            </Text>
          )}
        >
          <List dataSource={cart} renderItem={ListItem} />
        </ConfigProvider>

        {cart.length < 1 ? (
          <Button
            type='primary'
            block
            onClick={() => {
              onDrawerHide();
            }}
          >
            Continue Shopping
          </Button>
        ) : (
          <>
            <Button type='primary' block>
              Checkout
            </Button>
            <Button
              type='text'
              block
              onClick={() => {
                onDrawerHide();
              }}
            >
              Continue Shopping
            </Button>
          </>
        )}
      </Space>
    </Drawer>
  );
};

export default Cart;
