import axios from 'axios';

// service-category-controller
export const serviceCategories = () => axios.get('/service-categories');

// service-controller
export const services = () => axios.get('/services');

// service-provider-assignment-controller
export const serviceProvidersNearBy = body => axios.post('/service-providers-near-by', body);
