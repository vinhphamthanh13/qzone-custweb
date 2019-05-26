import axios from 'axios';

// customer flow resource
const customerTrackingAppointmentByEventId = data => axios.get(`/customer/tracking/appointment/${data}`);

export const trackingAllAppointmentByEventId = list => axios.all(
  list.map(eventId => customerTrackingAppointmentByEventId(eventId)),
).then(axios.spread((...responses) => [responses, null]))
  .catch(error => [null, JSON.stringify(error)]);
