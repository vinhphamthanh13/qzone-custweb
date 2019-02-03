import axios from 'axios';

export const registerCustomer = async (body, callback) => {
  const {
    address, email, givenName, telephone, userSub,
  } = body;
  const registerServiceData = {
    address, email, givenName, telephone, userSub, familyName: '', userStatus: 'CONFIRMED',
  };
  const response = await axios.post('/customers', registerServiceData);
  return callback(response);
};

export const loginCustomer = body => axios.post('/login', body);
export const getCustomerByEmail = body => axios.post('/customers-by-email/{email}', body);
