import axios from 'axios';
import {
  SURVEY_URL,
  ANSWER_SURVEY_URL,
} from 'config/api';

// survey controller
export const surveys = headers => axios.get(SURVEY_URL, headers);
export const answerSurvey = (data, headers) => axios.post(ANSWER_SURVEY_URL, data, headers);
export const surveyAnswersResponseByUser = (surveyId, userId) => axios.get(
  `${ANSWER_SURVEY_URL}/${surveyId}/${userId}`,
);
export const getSurveyById = data => axios.get(`${SURVEY_URL}/${data}`);
