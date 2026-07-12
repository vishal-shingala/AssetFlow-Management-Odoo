import apiClient from '../../../lib/api';

export const signup = async (userData) => {
  return apiClient.post('/auth/signup', userData);
};
