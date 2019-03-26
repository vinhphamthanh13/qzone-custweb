import axios from 'axios';

export const getProvider = id => axios.get(`/services-by-provider-id/${id}`);
