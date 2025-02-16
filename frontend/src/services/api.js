import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    throw error;
  }
};