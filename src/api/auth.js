import axios from 'axios';

export const registerCustomer = body => axios.post('/customers', body);

export const getCustomerByEmail = body => axios.post('/customers-by-email/{email}', body);
