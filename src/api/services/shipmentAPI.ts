import axios from '@api/axiosInstance';

export const shippingFeeListAPI = () => axios.get(`shipment/shipping_fee/`);

export const pickupLocListAPI = () => axios.get(`shipment/pickup_loc/`);
