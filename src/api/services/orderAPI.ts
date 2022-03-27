import axios from '@api/axiosInstance';

export const placeOrderAPI = (items, voucher, address, pickup) =>
  axios.post(
    `order/`,
    pickup
      ? {
          items: items,
          voucher: voucher !== '' ? voucher : undefined,
          pickup: pickup,
        }
      : {
          items: items,
          voucher: voucher !== '' ? voucher : undefined,
          address: address,
        }
  );
