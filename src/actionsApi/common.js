import axios from 'axios';

// event-resource
export const findEventByCustomerId = id => axios.get(`/find-events-by-customer-id/${id}`);
