import axios from 'axios';

export const searchProvidersByService = serviceId => axios.get(`/providers-services-by-serviceid/${serviceId}`);

export const searchProviderById = providerId => axios.get(`/providers/${providerId}`);
