import axios from 'axios';

export const getProviderServices = id => axios.get(`/services-by-provider-id/${id}`);
export const getProviderDetail = id => axios.get(`/users/${id}`);
