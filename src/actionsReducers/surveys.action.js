import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  surveys,
  answerSurvey,
  surveyAnswersResponseByUser,
  getSurveyById as getSurveyByIdApi,
} from 'actionsApi/surveys';

export const SET_SURVEYS = 'ASSESSMENT.SET_SURVEYS';
export const SET_SURVEY_BY_ID = 'ASSESSMENT.SET_SURVEY_BY_ID';
export const SET_ASSESSMENTS = 'ASSESSMENT.SET_ASSESSMENTS';
export const SET_ANSWERED_ASSESSMENT = 'ASSESSMENT.SET_ANSWERED_ASSESSMENT';

const setSurveysAction = payload => ({
  type: SET_SURVEYS,
  payload,
});

export const setAssessmentAction = payload => ({
  type: SET_ASSESSMENTS,
  payload,
});

const setAnsweredAssessment = payload => ({
  type: SET_ANSWERED_ASSESSMENT,
  payload,
});

const setSurveyByIdAction = payload => ({
  type: SET_SURVEY_BY_ID,
  payload,
});

export const setSurveys = headers => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(surveys, [headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setSurveysAction(result));
  }
  dispatch(setLoading(false));
};

export const createAssessmentResponse = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(answerSurvey, [data]);
  if (error) {
    dispatch(setError(error));
  } else if (result) {
    dispatch(setAnsweredAssessment(result));
  }
  dispatch(setLoading(false));
};

export const setAnsweredAssessmentByUser = (surveyId, userId) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(surveyAnswersResponseByUser, [surveyId, userId]);
  if (error) {
    dispatch(setError(error));
  } else if (result) {
    dispatch(setAnsweredAssessment(result));
  }
  dispatch(setLoading(false));
};

export const setSurveyById = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(getSurveyByIdApi, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setSurveyByIdAction(result));
  }
  dispatch(setLoading(false));
};

export const getSurveyById = surveyId => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(getSurveyByIdApi, [surveyId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAssessmentAction([result]));
  }
  dispatch(setLoading(false));
};
