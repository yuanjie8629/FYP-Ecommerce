import axios from '@api/axiosInstance';

export const checkVoucherAPI = (code, subtotal) =>
  axios.post(`voucher/check/`, { code: code, subtotal_price: subtotal });
