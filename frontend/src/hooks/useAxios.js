import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useAxios = () => {
  const { token } = useAuth();

  const instance = axios.create({ baseURL: '/api' });

  instance.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
};

export default useAxios;