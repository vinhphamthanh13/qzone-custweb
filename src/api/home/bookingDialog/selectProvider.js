import axios from 'axios';

export const searchProvidersByService = () => axios.get('/services');
