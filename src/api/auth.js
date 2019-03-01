import axios from 'axios';
import { FIND_BY_MAIL } from 'config/url';

export const getCustomerByEmail = body => axios.post(FIND_BY_MAIL, body);
