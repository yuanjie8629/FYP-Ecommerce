import axios from '@api/axiosInstance';
import { getUserId } from '@utils/storageUtils';

export const cartDetailsAPI = () => axios.get(`cart/${getUserId()}/`);

export const cartAddAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/add/`, { item: id, quantity: quantity });

export const cartRemoveAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/remove/`, { item: id, quantity: quantity });

export const cartSetQuantityAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/set/`, { item: id, quantity: quantity });

