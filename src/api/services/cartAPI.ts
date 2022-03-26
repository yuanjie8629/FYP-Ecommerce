import axios from '@api/axiosInstance';
import { getUserId } from '@utils/storageUtils';

export const cartDetailsForUserAPI = (state?, voucher?) =>
  axios.get(
    `cart/${getUserId()}/${
      state && voucher
        ? `?state=${state}&voucher=${voucher}`
        : state
        ? `?state=${state}`
        : voucher
        ? `?voucher=${voucher}`
        : ''
    }`
  );

export const cartAddAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/add/`, { item: id, quantity: quantity });

export const cartRemoveAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/remove/`, { item: id, quantity: quantity });

export const cartSetQuantityAPI = (id, quantity) =>
  axios.post(`cart/${getUserId()}/set/`, { item: id, quantity: quantity });

export const cartDetailsAPI = (data, state?) => {
  return axios.post(
    `cart/details/`,
    state ? { state: state, list: data } : { list: data }
  );
};
