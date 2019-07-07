import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import { surveys } from 'actionsApi/surveys';

export const SET_SURVEYS = 'ASSESSMENT.SET_SURVEY';

const setSurveyAction = payload => ({
  type: SET_SURVEYS,
  payload,
});

export const setSurveys = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(surveys, []);
  if ((result && !result.success) || error) {
    dispatch(setError(result.message || error));
  } else {
    dispatch(setSurveyAction(result));
  }
  dispatch(setLoading(false));
};
