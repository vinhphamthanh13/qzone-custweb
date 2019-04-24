import axios from 'axios';

export const fetchOrganization = id => axios.get(`/organizations/${id}`);
export const fetchProviders = businessId => axios.get(`/organizations-option-by-business-admin-id/${businessId}`);
