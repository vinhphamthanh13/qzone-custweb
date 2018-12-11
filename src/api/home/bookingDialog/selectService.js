import axios from 'axios';

export const searchServicesByOrgId = () => axios.get('/services');
