import axios from '@api/axiosInstance';

export const itemPrevAPI = (searchParam?: string) =>
  axios.get(`item/${searchParam !== undefined ? searchParam : ''}`);

export const itemDetailsAPI = (id) => axios.get(`item/${id}/`);

export const productPrevAPI = (searchParam?: string) =>
  axios.get(`item/product/${searchParam !== undefined ? searchParam : ''}`);

export const packagePrevAPI = (searchParam?: string) =>
  axios.get(`item/package/${searchParam !== undefined ? searchParam : ''}`);
