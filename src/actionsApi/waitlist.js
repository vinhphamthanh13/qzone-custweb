import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitLists = data => axios.post('/waitlists', data);
export const waitListsByCustomerId = data => axios.get(`/waitlists/customer/${data}`);
export const cancelWaitLists = data => axios.delete(`/waitlists/${data}`);
