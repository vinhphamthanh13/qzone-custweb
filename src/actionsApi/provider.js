import axios from 'axios';

// ********** user-controller *********** //
export const users = id => axios.get(`/users/${id}`);
export const providersByOrgRef = orgRef => axios.get(`/providers/org/ref/${orgRef}`);
// *********** service-controller ********** //
export const serviceByProviderId = id => axios.get(`/services-by-provider-id/${id}`);

// ********** event-resource ********** //
// temporary-services
export const temporaryServicesByServiceId = sId => axios.get(`/find-temporary-services-by-service-id/${sId}`);

// appointment-resource
export const availabilitiesByTemporaryServiceId = id => axios.get(`/availabilities/temporary/service/${id}`);
export const availabilitiesByTemporaryServiceIdBulk = list =>
  axios.all(list.map(id => availabilitiesByTemporaryServiceId(id)))
    .then(axios.spread((...responses) => [responses, null]))
    .catch(error => [null, JSON.stringify(error)]);
export const queryProvider = data => axios.post('/users/provider/query', data);
export const tempServiceDateProviderByServiceId = sId => axios.get(`/temp-services/date/provider/${sId}`);
export const availabilitiesProviderServiceDate = data => axios.post('/availabilities/provider/service/date', data);
