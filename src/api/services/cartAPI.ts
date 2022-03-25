import axios from '@api/axiosInstance';
import { getUserId } from '@utils/storageUtils';

export const cartDetailsForUserAPI = (state?) =>
  axios.get(`cart/${getUserId()}/${state ? `?state=${state}` : ''}`);

export const cartAddAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/add/`, { item: id, quantity: quantity });

export const cartRemoveAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/remove/`, { item: id, quantity: quantity });

export const cartSetQuantityAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/set/`, { item: id, quantity: quantity });

export const cartDetailsAPI = (data, state?) => {
  console.log(state);
  return axios.post(
    `cart/details/`,
    state ? { state: state, list: data } : { list: data }
  );
};
