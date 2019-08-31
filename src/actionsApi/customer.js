import axios from 'axios';

// customer flow resource
const customerTrackingAppointmentByEventId = (data, headers) => {
  console.log('ranking ', headers);
  return axios.get(
    `/customer/tracking/appointment/${data}`, headers,
  );
};

export const trackingAllAppointmentByEventId = (list = [], headers) => axios.all(
  list.map(eventId => customerTrackingAppointmentByEventId(eventId, headers)),
).then(axios.spread((...responses) => [responses, null]))
  .catch(error => [null, JSON.stringify(error)]);
