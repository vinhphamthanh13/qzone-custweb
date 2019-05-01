import axios from 'axios';

// *********** organization controller ********** //
// organizations/{id}
export const fetchOrganization = id => axios.get(`/organizations/${id}`);

// ********** service-provider-assignment-controller ********** //
// service-providers
export const serviceProviders = () => axios.get('/service-providers');
