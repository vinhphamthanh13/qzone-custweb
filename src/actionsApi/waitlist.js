import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitLists = (data, headers) => axios.post('/waitlists', data, headers);
export const waitListsByCustomerId = (data, headers) => axios.get(`/waitlists/customer/${data}`, headers);
export const waitListsById = (data, headers) => axios.get(`/waitlists/${data}`, headers);
export const cancelWaitLists = (data, headers) => axios.delete(`/waitlists/${data}`, headers);
const validateWaitLists = (data, headers) => axios.post('/waitlists/validate/', data, headers);
export const validateWaitListsBulk = (list, headers) => axios.all(
  list.map(validationData => validateWaitLists(validationData, headers)),
).then(axios.spread((...responses) => [responses, null]))
  .catch(error => [null, JSON.stringify(error)]);
