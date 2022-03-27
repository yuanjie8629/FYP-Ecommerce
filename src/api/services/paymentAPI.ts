import axios from '@api/axiosInstance';
import { paymentMethodType } from '@pages/Checkout/Payment';

export const createPaymentSessionAPI = (
  totalAmt:number,
  paymentMethod: paymentMethodType
) =>
  axios.post(`payment/create_checkout_session/`, {
    total_amt: totalAmt,
    payment_method: paymentMethod,
  });
