import axios from 'axios';

// service-controller
export const serviceById = data => axios.get(`/services/${data}`);
