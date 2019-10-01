import axios from 'axios';

// *********** organization controller ********** //
export const fetchOrganization = id => axios.get(`/organizations/${id}`);
export const organizations = () => axios.get('/organizations');
// ********** service-provider-assignment-controller ********** //
export const serviceProviders = () => axios.get('/service-providers');
