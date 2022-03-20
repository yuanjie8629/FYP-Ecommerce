import axios from '@api/axiosInstance';
import { getUserId } from '@utils/storageUtils';

export const accDetailsAPI = () => axios.get(`customer/${getUserId()}`);
