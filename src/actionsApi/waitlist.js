import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitLists = (data, headers) => axios.post('/waitlists', data, headers);
export const waitListsByCustomerId = (data, headers) => axios.get(`/waitlists/customer/${data}`, headers);
export const waitListsById = (data, headers) => axios.get(`/waitlists/${data}`, headers);
export const cancelWaitLists = (data, headers) => axios.delete(`/waitlists/${data}`, headers);
