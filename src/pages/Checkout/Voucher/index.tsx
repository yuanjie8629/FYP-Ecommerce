import { cartDetailsAPI, cartDetailsForUserAPI } from '@api/services/cartAPI';
import Button from '@components/Button';
import MainCard from '@components/Card/MainCard';
import { CartContext } from '@contexts/CartContext';
import { MessageContext } from '@contexts/MessageContext';
import { getItemStatus } from '@pages/Item/ItemDetails';
import { serverErrMsg } from '@utils/messageUtils';
import { getCartItem, getUserId, refreshCart } from '@utils/storageUtils';
import {
  CardProps,
  Col,
  ConfigProvider,
  Divider,
  Grid,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface VoucherProps extends CardProps {
  onCartClick?: () => void;
}

const Voucher = ({ onCartClick, ...props }: VoucherProps) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [cart, setCart, cartPrice, setCartPrice] = useContext(CartContext);
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (getUserId()) {
      console.log('Retrieving cart items...');
      cartDetailsForUserAPI()
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          console.log('Retrieved cart items.');
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
          }
        });
    } else if (getCartItem()) {
      console.log('Retrieving cart items...');
      cartDetailsAPI(
        getCartItem().map((item) => {
          return { id: item.id, quantity: item.quantity };
        })
      )
        .then((res) => {
          setCart(res.data?.items);
          setCartPrice(res.data?.subtotal_price);
          refreshCart(res.data?.items);
          console.log('Retrieved cart items.');
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            showServerErrMsg();
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserId()]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <MainCard>
      <Space direction='vertical' size={20} className='full-width'>
        <Title level={5}>Voucher</Title>

        <Row gutter={[10, 20]} justify={screens.xs ? 'end' : 'start'}>
          <Col xs={24} sm={18}>
            <Input placeholder='Enter Voucher Code' />
          </Col>
          <Col xs={12} sm={6}>
            <Button type='primary' block>
              Apply
            </Button>
          </Col>
        </Row>
      </Space>
    </MainCard>
  );
};

export default Voucher;
