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
  Divider,
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
import {
  addItemToCart,
  getCartItem,
  getCartItemCount,
  getUserId,
  removeItemFromCart,
  setQuantityToCart,
} from '@utils/storageUtils';
import {
  cartAddAPI,
  cartRemoveAPI,
  cartSetQuantityAPI,
} from '@api/services/cartAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import { moneyFormatter } from '@utils/numUtils';

interface CartProps extends DrawerProps {
  onDrawerHide?: () => void;
}

const Cart = ({ onDrawerHide = () => null, ...props }: CartProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useContext(CartContext);
  const [cartLoading, setCartLoading] = useState([]);
  const [messageApi] = useContext(MessageContext);
  const [cartValue, setCartValue] = useState<number>();
  const itemCount = cart.length || getCartItemCount();
  const user = getUserId();
  const totalPrice = () => {
    let sum = 0;
    if (user) {
      cart.forEach((cartItem) => {
        let { special_price, price, quantity } = cartItem;
        sum += special_price ? special_price * quantity : price * quantity;
      });
    } else {
      if (getCartItem())
        getCartItem().forEach((cartItem) => {
          let { special_price, price, quantity } = cartItem;
          if (special_price)
            special_price = moneyFormatter(parseFloat(special_price), true);
          price = moneyFormatter(parseFloat(price), true);
          quantity = parseInt(quantity);
          sum += special_price ? special_price * quantity : price * quantity;
        });
    }
    return sum;
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const handleCartAdd = (item) => {
    setCartLoading([...cartLoading, item.id]);
    if (user) {
      cartAddAPI(item.id, 1)
        .then((res) => {
          setCart(res.data.items);
          setCartLoading(cartLoading.filter((cart) => cart !== item.id));
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(cartLoading.filter((cart) => cart !== item.id));
          }
        });
    } else {
      addItemToCart(item);
      setCartLoading(cartLoading.filter((cart) => cart !== item.id));
    }
  };

  const handleCartSet = (item, value) => {
    setCartLoading([...cartLoading, item.id]);
    if (user) {
      cartSetQuantityAPI(item.id, value)
        .then((res) => {
          setCart(res.data.items);
          setCartLoading(cartLoading.filter((cart) => cart !== item.id));
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(cartLoading.filter((cart) => cart !== item.id));
          }
        });
    } else {
      setQuantityToCart(item.id, value);
      setCartLoading(cartLoading.filter((cart) => cart !== item.id));
    }
  };

  const handleCartMinus = (item) => {
    setCartLoading([...cartLoading, item.id]);
    if (user) {
      cartRemoveAPI(item.id, 1)
        .then((res) => {
          setCart(res.data.items);
          setCartLoading(cartLoading.filter((cart) => cart !== item.id));
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(cartLoading.filter((cart) => cart !== item.id));
          }
        });
    } else {
      removeItemFromCart(item.id);
      setCartLoading(cartLoading.filter((cart) => cart !== item.id));
    }
  };

  const ListItem = (item) => (
    <List.Item>
      <Spin
        spinning={cartLoading.includes(item.id)}
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
                    <Text
                      strong
                      className='text-lg color-primary'
                      style={{ marginRight: 10 }}
                    >
                      RM {item.special_price}
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
          align='top'
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
          <List
            dataSource={user ? cart : getCartItem()}
            renderItem={ListItem}
          />
        </ConfigProvider>

        {itemCount === undefined ||
        itemCount === null ||
        itemCount.length < 1 ? (
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
            <Divider dashed style={{ marginBottom: 5 }} />
            <Row justify='space-between' style={{ margin: '15px 0' }}>
              <Col>
                <Text className='text-lg'>
                  Total ({itemCount} {itemCount === 1 ? 'Item' : 'Items'}):{' '}
                </Text>
              </Col>
              <Col>
                <Text strong className='text-lg'>
                  RM {totalPrice()}
                </Text>
              </Col>
            </Row>
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
