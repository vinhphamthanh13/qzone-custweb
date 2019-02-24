import axios from 'axios';

export const getServiceCategories = () => axios.get('/service-categories');

export const searchServicesByName = name => axios.get(`/services/search/name?searchName=${name}`);

export const searchServicesByCategory = categoryId => axios.get(`/servicesByServiceCategoryId/${categoryId}`);

export const searchOrganizationById = orgId => axios.get(`/organizations/${orgId}`);

export const getServices = () => axios.get('/services');
