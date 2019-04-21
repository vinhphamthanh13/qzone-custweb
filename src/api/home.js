import axios from 'axios';


export const searchServicesByCategory = categoryId => axios.get(`/servicesByServiceCategoryId/${categoryId}`);

export const searchOrganizationById = orgId => axios.get(`/organizations/${orgId}`);

export const getServices = () => axios.get('/services');

export const getCustomerEvents = id => axios.get(`/find-events-by-customer-id/${id}`);


export const fetchServiceProviderById = id => axios.get(`/service-providers/${id}`);

// Migration

// service-category-controller
export const serviceCategories = () => axios.get('/service-categories');

// service-controller
export const services = () => axios.get('/services');
export const searchServicesByName = name => axios.get(`/services/search/name?searchName=${name}`);

// service-provider-assignment-controller
export const serviceProviders = () => axios.get('/service-providers');
export const serviceProvidersNearBy = body => axios.post('/service-providers-near-by', body);
