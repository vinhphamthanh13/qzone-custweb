import axios from 'axios';

// service-category-controller
export const serviceCategories = () => axios.get('/service-categories');

// service-controller
export const services = () => axios.get('/services');
export const servicesSearchByName = name => axios.get(`/services/search/name?searchName=${name}`);

// service-provider-assignment-controller
export const serviceProviders = () => axios.get('/service-providers');
export const serviceProvidersNearBy = body => axios.post('/service-providers-near-by', body);
