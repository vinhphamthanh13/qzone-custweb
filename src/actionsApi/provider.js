import axios from 'axios';

// ********** user-controller *********** //
// users/{id}
export const users = id => axios.get(`/users/${id}`);

// *********** service-controller ********** //
export const serviceByProviderId = id => axios.get(`/services-by-provider-id/${id}`);

// ********** event-resource ********** //
// temporary-services
export const temporaryServices = () => axios.get('/temporary-services');
export const temporaryServicesByServiceId = sId => axios.get(`/find-temporary-services-by-service-id/${sId}`);

// appointment-resource
export const availabilitiesByTemporaryServiceId = id => axios.get(`/availabilities/temporary/service/${id}`);
export const availabilitiesByTemporaryServiceIdBulk = list =>
  axios.all(list.map(id => availabilitiesByTemporaryServiceId(id)))
    .then(axios.spread((...responses) => [responses, null]))
    .catch(error => [null, JSON.stringify(error)]);
