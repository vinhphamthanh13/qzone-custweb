import axios from 'axios';

export const registerWaitList = data => axios.post('/waitlists', data);
export const fetchWaitList = () => axios.get('/waitlists');
