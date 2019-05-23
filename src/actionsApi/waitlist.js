import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitLists = data => axios.post('/waitlists', data);
export const waitListsByCustomerId = data => axios.get(`/waitlists/customer/${data}`);
export const waitListsById = data => axios.get(`/waitlists/${data}`);
export const cancelWaitLists = data => axios.delete(`/waitlists/${data}`);
const validateWaitLists = data => axios.post('/waitlists/validate/', data);
export const validateWaitListsBulk = list => axios.all(
  list.map(validationData => validateWaitLists(validationData)),
).then(axios.spread((...responses) => [responses, null]))
  .catch(error => [null, JSON.stringify(error)]);
