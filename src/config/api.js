import axios from 'axios';

const BASE_URL = 'http://13.238.116.171:8080';
export const SURVEY_URL = 'http://54.252.134.87:8090/api';

axios.defaults.baseURL = `${BASE_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
