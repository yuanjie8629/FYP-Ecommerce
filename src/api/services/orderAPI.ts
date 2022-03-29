import axios from '@api/axiosInstance';

export const placeOrderAPI = (items, voucher, address, pickup, email) =>
  axios.post(
    `order/`,
    pickup
      ? {
          item: items,
          voucher: voucher !== '' ? voucher : undefined,
          pickup: pickup,
          email: email !== '' ? email : undefined,
        }
      : {
          item: items,
          voucher: voucher !== '' ? voucher : undefined,
          address: address,
          email: email !== '' ? email : undefined,
        }
  );

export const orderListAPI = (searchParam?: string) =>
  axios.get(`order/${searchParam !== undefined ? searchParam : ''}`);

export const orderDetailsAPI = (id) => axios.get(`order/${id}/`);

export const orderSearchAPI = (email, orderID) =>
  axios.post(`order/search/`, { email: email, order_id: orderID });
