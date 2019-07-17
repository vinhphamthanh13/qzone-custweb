import axios from 'axios';
import { FIND_BY_MAIL, SOCIAL_LOGIN, FACEBOOK_USER } from './url';

export const getCustomerByEmail = body => axios.post(FIND_BY_MAIL, body);

export const saveSocialUser = body => axios.post(SOCIAL_LOGIN, body);

export const catchAwsUser = body => axios.put('/aws-users', body);

export const fetchUserDetail = userId => axios.get(`/users/${userId}`);

// ********** firebase ********** //
export const firebaseStoreUser = data => axios.post('/firebase/store/user', data);

// ********** Facebook User ********* //
export const fetchFBUser = token => axios.get(FACEBOOK_USER, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
