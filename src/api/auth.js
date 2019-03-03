import axios from 'axios';
import { FIND_BY_MAIL, SOCIAL_LOGIN } from 'config/url';

export const getCustomerByEmail = body => axios.post(FIND_BY_MAIL, body);
export const saveSocialEmail = body => axios.post(SOCIAL_LOGIN, body);
