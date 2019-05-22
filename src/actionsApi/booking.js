import axios from 'axios';

// service-controller
export const serviceById = data => axios.get(`/services/${data}`);

// user-controller
export const providersByServiceId = data => axios.get(`/providers-by-service-id/${data}`);

// appointment-resource
export const availabilitiesBySpecialEventId = data => axios.post('/availabilities/temporary/service/filter', data);

export const availabilitiesBySpecialEventIdBulk = eventList => axios.all(
  eventList.map(data => availabilitiesBySpecialEventId(data)),
).then(axios.spread((...responses) => [responses, null]))
  .catch(error => [null, JSON.stringify(error)]);

// ********** event-resource ********** //
export const events = data => axios.post('/events', data);
export const temporaryServicesById = data => axios.get(`/temporary-services/${data}`);
