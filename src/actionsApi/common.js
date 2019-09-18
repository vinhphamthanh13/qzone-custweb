import axios from 'axios';

// ********** event-resource ********** //
export const findEventByCustomerId = (id, headers) => axios.get(`/find-events-by-customer-id/${id}`, headers);
export const temporaryServices = () => axios.get('/temporary-services');
export const eventById = id => axios.get(`/events/${id}`);
export const reschedule = data => axios.put('/events/reschedule', data);
const servicesByServiceCategoryId = id => axios.get(`servicesByServiceCategoryId/${id}`);
export const servicesByServiceCategoryBulk = list => axios.all(
  list.map(catId => servicesByServiceCategoryId(catId))
).then(axios.spread((...responses) => [responses, null]))
    .catch(error => [null, JSON.stringify(error)]);
