import axios from 'axios';

export const postEvent = body => axios.post('/events', body);
