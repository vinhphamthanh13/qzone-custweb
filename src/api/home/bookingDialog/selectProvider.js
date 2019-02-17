import axios from 'axios';

export const searchProvidersByService = serviceId => axios.get(`/service-providers-by-serviceid/${serviceId}`);

export const searchProviderById = providerId => axios.get(`/providers/${providerId}`);

export const findAvailabilitiesByDateRange = body => axios.post('/find-availabilities-by-date-range', body);
