import axios from 'axios';
// appointment-resource
// ********** event-resource ********** //
export const events = (data, headers) => axios.post('/events', data, headers);
export const waitlistConfirm = data => axios.post('/waitlists/confirm', data);
export const temporaryServicesById = (data, headers) => axios.get(`/temporary-services/${data}`, headers);
