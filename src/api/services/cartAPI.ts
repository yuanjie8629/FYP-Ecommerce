import axios from '@api/axiosInstance';
import { getUserId } from '@utils/userUtils';

export const cartAddAPI = (id, quantity) =>
  axios.post(`cart/add/`, { user: getUserId(), item: id, quantity: quantity });
