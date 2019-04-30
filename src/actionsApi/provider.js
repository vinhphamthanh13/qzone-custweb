import axios from 'axios';

// ********** user-controller *********** //
// users/{id}
export const users = id => axios.get(`/users/${id}`);

// *********** service-controller ********** //
export const serviceByProviderId = id => axios.get(`/services-by-provider-id/${id}`);

// ********** event-resource ********** //
// temporary-services
export const temporaryServices = () => axios.get('/temporary-services');
