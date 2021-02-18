import axios from 'axios';

const axiosClient = axios.create({
  baseURL: __DEV__ ? 'http://localhost:3000/api' : '',
});

export default axiosClient;
