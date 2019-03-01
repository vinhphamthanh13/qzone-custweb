import axios from 'axios';
import BASE_URL from './url';

axios.defaults.baseURL = `${BASE_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
