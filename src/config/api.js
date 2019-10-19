import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.quezone.com.au'
  : 'https://api.quezone.com.au';
  // : 'http://54.252.134.87:8080';
export const SURVEY_URL = `${BASE_URL}/api/surveys`;
export const ANSWER_SURVEY_URL = `${BASE_URL}/api/survey-answers`;

axios.defaults.baseURL = `${BASE_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post.Accept = 'application/json';
axios.defaults.headers.get.Accept = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
