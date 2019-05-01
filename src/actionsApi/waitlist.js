import axios from 'axios';

// ********** wait-list-resource ********** //
export const registerWaitList = data => axios.post('/waitlists', data);
export const waitLists = () => axios.get('/waitlists');
