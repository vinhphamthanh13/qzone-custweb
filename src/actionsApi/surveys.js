import axios from 'axios';
import {
  SURVEY_URL,
  ANSWER_SURVEY_URL,
} from 'config/api';

// survey controller
export const surveys = () => axios.get(SURVEY_URL);
export const answerSurvey = data => axios.post(ANSWER_SURVEY_URL, data);
export const surveyAnswersResponseByUser = (surveyId, userId) => axios.get(
  `${ANSWER_SURVEY_URL}/${surveyId}/${userId}`,
);
export const getSurveyById = data => axios.get(`${SURVEY_URL}/${data}`);
