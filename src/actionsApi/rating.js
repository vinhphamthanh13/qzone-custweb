import axios from 'axios';

// service-provider-assignment-controller
export const serviceProvidersRating = (body, headers) => axios.post('/service-providers-rating', body, headers);
