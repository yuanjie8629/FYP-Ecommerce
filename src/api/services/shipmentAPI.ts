import axios from '@api/axiosInstance';

export const pickupLocListAPI = () => axios.get(`shipment/pickup_loc/`);
