import axios from 'axios';

export const getOrgs = id => axios.get(`/organizations/${id}`);
