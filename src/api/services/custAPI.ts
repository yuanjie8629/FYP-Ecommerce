import axios from '@api/axiosInstance';
import { getUserId } from '@utils/storageUtils';

export const changePassAPI = (data) =>
  axios.patch(`customer/${getUserId()}/change_pass/`, data);

export const accDetailsAPI = () => axios.get(`customer/${getUserId()}/`);

export const accUpdAPI = (data) =>
  axios.patch(`customer/${getUserId()}/`, data);

export const posRegAPI = (data) =>
  axios.post(`customer/position/registration/`, data);
