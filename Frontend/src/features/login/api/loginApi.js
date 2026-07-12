import apiClient from '../../../lib/api';

export const login = async (credentials) => {
  return apiClient.post('/auth/login', credentials);
};
