import axios from '@api/axiosInstance';

export const placeOrderAPI = (items, voucher, address, pickup, email) =>
  axios.post(
    `order/`,
    pickup
      ? {
          items: items,
          voucher: voucher !== '' ? voucher : undefined,
          pickup: pickup,
          email: email !== '' ? email : undefined,
        }
      : {
          items: items,
          voucher: voucher !== '' ? voucher : undefined,
          address: address,
          email: email !== '' ? email : undefined,
        }
  );
