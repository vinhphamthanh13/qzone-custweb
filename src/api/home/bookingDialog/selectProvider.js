import axios from 'axios';

export const searchProvidersByService = serviceId => axios.get(`/providers-services-by-serviceid/${serviceId}`);

export const searchProviderById = providerId => axios.get(`/providers/${providerId}`);

export const findAvailabilitiesByDateSec = ({ serviceId, providerId, startSec }) => axios.post(
  '/find-availabilities-by-date-sec',
  { serviceId, providerId, startSec },
);
