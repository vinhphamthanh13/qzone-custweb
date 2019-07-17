import axios from 'axios';

export const BASE_URL = 'https://13.238.116.171:8080';
export const SURVEY_URL = `${BASE_URL}/api/surveys`;
export const ANSWER_SURVEY_URL = `${BASE_URL}/api/survey-answers`;
export const CLIENT_URL = 'http://custweb.quezone.com.au';

axios.defaults.baseURL = `${BASE_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
