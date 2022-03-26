import Button from '@components/Button';
import { findRoutePath } from '@utils/routingUtils';
import {
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Alert,
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
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {
  addItemToCart,
  getCartItem,
  getCartItemCount,
  getUserId,
  refreshCart,
  removeItemFromCart,
  setQuantityToCart,
} from '@utils/storageUtils';
import {
  cartAddAPI,
  cartDetailsAPI,
  cartRemoveAPI,
  cartSetQuantityAPI,
} from '@api/services/cartAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import SpinCircle from '@components/Spin/SpinCircle';
import { getItemStatus } from '@pages/Item/ItemDetails';

interface CartProps extends DrawerProps {
  onLoginRemind?: () => void;
  viewOnly?: boolean;
}

const Cart = ({
  onLoginRemind = () => null,
  viewOnly,
  ...props
}: CartProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [cart, setCart, cartPrice, setCartPrice] = useContext(CartContext);
  const [cartLoading, setCartLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [cartValue, setCartValue] = useState<{ id: number; value: number }>();
  const [checkout, setCheckout] = useState(true);
  const itemCount = cart.length || getCartItemCount();
  const user = getUserId();

  useEffect(() => {
    let available = true;
    cart.forEach((cartItem) => {
      if (cartItem.stock === 0) {
        setCheckout(false);
        available = false;
      }
    });
    if (available) {
      setCheckout(true);
    }
  }, [cart]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const updateLocalCart = async (cart) => {
    if (!getCartItem()) {
      setCart([]);
      return;
    }

    await cartDetailsAPI(cart)
      .then((res) => {
        setCart(res.data?.items);
        setCartPrice(res.data?.subtotal_price);
        refreshCart(res.data?.items);
        console.log('Retrieved cart items.');
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
        }
      });
  };

  const handleCartAdd = async (item) => {
    setCartLoading(true);
    if (user) {
      cartAddAPI(item.id, 1)
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          setCartLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(false);
          }
        });
    } else {
      await updateLocalCart(addItemToCart(item));
      setCartLoading(false);
    }
  };

  const handleCartSet = async (item, value) => {
    setCartLoading(true);
    if (user) {
      cartSetQuantityAPI(item.id, value)
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          setCartLoading(false);
          setCartValue(undefined);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(false);
          }
        });
    } else {
      let cart = setQuantityToCart(item, value);
      if (cart.length > 0) {
        await updateLocalCart(cart);
      } else {
        setCart([]);
        setCartPrice(undefined);
      }
      setCartLoading(false);
      setCartValue(undefined);
    }
  };

  const handleCartMinus = async (item) => {
    setCartLoading(true);
    if (user) {
      cartRemoveAPI(item.id, 1)
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          setCartLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
            setCartLoading(false);
          }
        });
    } else {
      await updateLocalCart(removeItemFromCart(item));
      setCartLoading(false);
    }
  };

  const ListItem = (item) => (
    <List.Item>
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
            <div className='text-button-wrapper'>
              <Title
                level={5}
                onClick={() => {
                  if (item.stock > 0) {
                    navigate(`/item/${item.id}`);
                  }
                }}
                className='text-button'
              >
                {item.name}
              </Title>
            </div>
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
            <Row justify='space-between' align='middle' className='full-width'>
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
                      cartValue?.id === item.id
                        ? cartValue?.value
                        : item.quantity
                    }
                    disabled={item.stock === 0}
                    onChange={(value) => {
                      setCartValue({ id: item.id, value: value });
                    }}
                    onBlur={() => {
                      if (
                        cartValue?.id === item.id &&
                        cartValue?.value > item.stock
                      ) {
                        setCartValue({ id: item.id, value: item.stock });
                      }
                      if (
                        cartValue?.id === item.id &&
                        cartValue?.value !== undefined
                      ) {
                        handleCartSet(item, cartValue?.value);
                      }
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
        {!checkout && (
          <Alert
            showIcon
            type='error'
            message={
              <Text type='danger'>Please remove out of stock items.</Text>
            }
          />
        )}
        <SpinCircle spinning={cartLoading}>
          <ConfigProvider
            renderEmpty={() => (
              <Text type='secondary' className='text-lg'>
                There are no items in your cart.
              </Text>
            )}
          >
            <List rowKey='id' dataSource={cart} renderItem={ListItem} />
          </ConfigProvider>
        </SpinCircle>

        {itemCount === undefined || itemCount === null || itemCount < 1 ? (
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
          !viewOnly && (
            <>
              <Divider dashed style={{ marginBottom: 5 }} />
              <Row justify='space-between' style={{ margin: '15px 0' }}>
                <Col>
                  <Text className='text-lg'>
                    Subtotal ({itemCount} {itemCount === 1 ? 'Item' : 'Items'}):{' '}
                  </Text>
                </Col>
                <Col>
                  <Text strong className='text-lg'>
                    {cartLoading ? 'Calculating...' : `RM ${cartPrice}`}
                  </Text>
                </Col>
              </Row>
              <Button
                type='primary'
                block
                onClick={() => {
                  if (getUserId()) {
                    navigate(findRoutePath('checkout'));
                  } else {
                    onLoginRemind();
                  }
                }}
                style={{ height: 40 }}
                disabled={!checkout}
                color={!checkout ? 'grey' : undefined}
              >
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
          )
        )}
      </Space>
    </Drawer>
  );
};

export default Cart;
