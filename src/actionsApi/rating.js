import axios from 'axios';

// service-provider-assignment-controller
export const serviceProvidersRating = body => axios.post('/service-providers-rating', body);
