import axios from 'axios';

// service-controller
export const serviceById = data => axios.get(`/services/${data}`);

// user-controller
export const providersByServiceId = data => axios.get(`/providers-by-service-id/${data}`);
