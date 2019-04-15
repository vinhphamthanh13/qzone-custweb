import axios from 'axios';

export const searchProvidersByService = serviceId => axios.get(`/service-providers-by-serviceid/${serviceId}`);

export const searchProviderById = providerId => axios.get(`/users/${providerId}`);

export const findAvailabilitiesByDateRange = body => axios.post('/find-availabilities-by-date-range', body);

export const findSpecialEvents = id => axios.get(`/find-special-events-by-service-id/${id}`);
