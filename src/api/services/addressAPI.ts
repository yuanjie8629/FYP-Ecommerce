import axios from '@api/axiosInstance';

export const stateListAPI = () => axios.get(`postcode/state/`);

export const postcodeListAPI = () => axios.get(`postcode/`);

export const addressListAPI = () => axios.get(`address/`);

export const addressDetailsAPI = (id) => axios.get(`address/${id}/`);

export const addressDefaultAPI = () =>
  axios.get(`address/default/`);

export const addressAddAPI = (data) => axios.post(`address/`, data);

export const addressUpdAPI = (id, data) => axios.patch(`address/${id}/`, data);

export const addressDelAPI = (id) => axios.delete(`address/${id}/`);
