import axios from 'axios';

const BASE_URL = 'http://13.238.116.171:8080';
export const SURVEY_URL = `${BASE_URL}/api/surveys`;
export const ANSWER_SURVEY_URL = `${BASE_URL}/api/survey-answers`;

axios.defaults.baseURL = `${BASE_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
