import axios from 'axios';
import { createHeaders } from 'utils/apiHelpers';
import { FIND_BY_MAIL, SOCIAL_LOGIN } from './url';

export const getCustomerByEmail = (body, token) => axios.post(FIND_BY_MAIL, body, createHeaders(token));
export const saveSocialUser = (body, token) => axios.post(SOCIAL_LOGIN, body, createHeaders(token));
export const catchAwsUser = (body, token) => axios.put('/aws-users', body, createHeaders(token));
export const fetchUserDetail = (userId, token) => axios.get(`/users/${userId}`, createHeaders(token));
