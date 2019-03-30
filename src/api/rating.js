import axios from 'axios';

export const rateAppointmentByUser = body => axios.post('/service-providers-rating', body);
