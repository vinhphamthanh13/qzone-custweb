import axios from 'axios';

// customer flow resource
const customerTrackingAppointmentByEventId = data => axios.post('/customer/tracking/appointment/', data);

export const trackingAllAppointmentByEventId = list => axios.all(
  list.map(eventId => customerTrackingAppointmentByEventId(eventId)),
).then((...response) => [response, null])
  .catch(error => [null, JSON.stringify(error)]);
