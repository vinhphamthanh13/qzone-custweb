import axios from 'axios';
// user-controller
export const fetchProvidersByServiceId = sId => axios.get(`/providers-by-service-id/${sId}`);
// appointment-resource
// ********** event-resource ********** //
export const events = (data, headers) => axios.post('/events', data, headers);
export const waitlistConfirm = data => axios.post('/waitlists/confirm', data);
export const temporaryServicesById = (data, headers) => axios.get(`/temporary-services/${data}`, headers);
