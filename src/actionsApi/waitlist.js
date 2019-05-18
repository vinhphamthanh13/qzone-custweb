import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitLists = data => axios.post('/waitlists', data);
export const waitListsByCustomerId = data => axios.get(`/waitlists/customer/${data}`);
export const cancelWaitLists = data => axios.delete(`/waitlists/${data}`);
export const validateWaitLists = data => axios.post('/waitlists/validate/', data);
// export const validateWaitListsBulk = list => axios.all(
//   list.map(temporaryServiceId => validateWaitLists(temporaryServiceId)),
// ).then(axios.spread((...responses) => responses));
