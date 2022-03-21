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
  Row,
  Space,
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
import SpinCircle from '@components/Spin/SpinCircle';
import { getItemStatus } from '@pages/Item/ItemDetails';

interface CartProps extends DrawerProps {}

const Cart = (props: CartProps) => {
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
    setTimeout(() => messageApi.destroy(), 5000);
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
      addItemToCart(item, setCart);
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
          setCartValue(undefined);
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
      setCartValue(undefined);
    }
  };

  const handleCartMinus = (item) => {
    setCartLoading([...cartLoading, item.id]);
    if (user) {
      cartRemoveAPI(item.id, 1)
        .then((res) => {
          setCart(res.data.items ? res.data.items : []);
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
      <SpinCircle spinning={cartLoading.includes(item.id)}>
        <Row gutter={15} align='middle'>
          <Col xs={8} md={7}>
            <img
              src={item.thumbnail}
              alt={item.id}
              width='100%'
              style={{ border: '1px solid #e5e7eb' }}
            />
          </Col>
          <Col xs={16} md={17}>
            <Space direction='vertical' size={10} className='full-width'>
              <Title level={5}>{item.name}</Title>
              <Row justify='space-between'>
                <Col>{getItemStatus(item.stock)}</Col>
                <Col>
                  {item.special_price && (
                    <Text strong className='text-lg color-primary'>
                      RM {item.special_price}
                    </Text>
                  )}
                </Col>
              </Row>
              <Row
                justify='space-between'
                align='middle'
                className='full-width'
              >
                <Col>
                  <Space size={5}>
                    {item.quantity > 1 &&
                    cart.find((cartItem) => cartItem.id === item.id).stock !==
                      0 ? (
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
                        size='small'
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
                      size='small'
                      style={{ width: screens.md ? 50 : 40 }}
                      value={
                        cartValue !== undefined ? cartValue : item.quantity
                      }
                      disabled={item.stock === 0}
                      onChange={(value) => {
                        setCartValue(item.stock);
                        setCartValue(value);
                      }}
                      onBlur={() => {
                        if (cartValue > item.stock) {
                          setCartValue(item.stock);
                        }
                        handleCartSet(item, cartValue);
                      }}
                    />

                    <Button
                      size='small'
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
                  <Text
                    type={item.special_price ? 'secondary' : undefined}
                    strong
                    className='text-lg'
                    delete={item.special_price}
                  >
                    RM {item.price}
                  </Text>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </SpinCircle>
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
                props.onClose(null);
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
            rowKey='id'
            dataSource={user && cart ? cart : getCartItem()}
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
              props.onClose(null);
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
                  RM {totalPrice().toFixed(2)}
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
                props.onClose(null);
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
