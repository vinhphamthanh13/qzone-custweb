import axios from 'axios';

const handleSuccessResponse = callback => response => callback(response);
const handleErrorResponse = callback => (error) => { callback(error.response); };

export const verifyResendCode = (values, callback) => {
  axios.post('/users/code/verification', values)
    .then(handleSuccessResponse(callback))
    .catch(handleErrorResponse(callback));
};

export const registerCustomer = async (body, callback) => {
  const {
    address, email, givenName, telephone, userSub, userConfirmed,
  } = body;
  const eUserStatus = (userConfirmed === true ? 'CONFIRMED' : 'UNCONFIRMED');
  const registerServiceData = {
    address, email, givenName, telephone, userSub, familyName: '', userStatus: eUserStatus,
  };
  const response = await axios.post('/users', registerServiceData);
  return callback(response);
};

export const loginCustomer = body => axios.post('/login', body);
export const getCustomerByEmail = body => axios.post('/users/find-by-email', body);
