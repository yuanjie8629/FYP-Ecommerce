import { createPaymentSessionAPI } from '@api/services/paymentAPI';
import Button from '@components/Button';
import MainCard from '@components/Card/MainCard';
import { paymentMethodType } from '@pages/Checkout/Payment';
import { findRoutePath } from '@utils/routingUtils';
import { CardProps, Col, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

interface PayButtonProps extends CardProps {
  orderId?: string;
  totalAmt?: string;
  paymentMethod?: paymentMethodType;
  onPaymentRedirect?: (load: boolean) => void;
}

const PayButton = ({
  orderId,
  totalAmt,
  paymentMethod,
  onPaymentRedirect = () => null,
  ...props
}: PayButtonProps) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const handlePay = () => {
    onPaymentRedirect(true);
    createPaymentSessionAPI(parseFloat(totalAmt), paymentMethod, orderId)
      .then((res) => {
        if (res.data?.url) {
          window.open(res.data?.url, '_self');
        }
      })
      .catch((err) => {
        navigate(findRoutePath('paymentCancel'));
      });
  };
  return (
    <MainCard bodyStyle={{ padding: 20 }}>
      <Row justify={paymentMethod ? 'end' : 'space-between'} align='middle'>
        {!paymentMethod && (
          <Col>
            <Text strong type='danger'>Please select one payment method.</Text>
          </Col>
        )}
        <Col>
          <Button
            type='primary'
            style={{ width: screens.sm ? 150 : '100%' }}
            disabled={!(orderId && totalAmt && paymentMethod)}
            color={!(orderId && totalAmt && paymentMethod) ? 'grey' : undefined}
            onClick={handlePay}
          >
            Pay
          </Button>
        </Col>
      </Row>
    </MainCard>
  );
};

export default PayButton;
