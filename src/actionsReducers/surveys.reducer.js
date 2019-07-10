import {
  SET_SURVEYS,
  SET_ASSESSMENTS,
  SET_SURVEY_BY_ID,
  SET_ANSWERED_ASSESSMENT,
} from 'actionsReducers/surveys.action';

const initState = {
  surveyList: null,
  customerAssessment: [],
  surveyById: null,
  surveyAnswers: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_SURVEYS:
      return {
        ...state,
        surveyList: action.payload,
      };
    case SET_ASSESSMENTS:
      return {
        ...state,
        customerAssessment: action.payload,
      };
    case SET_SURVEY_BY_ID:
      return {
        ...state,
        surveyById: action.payload,
      };
    case SET_ANSWERED_ASSESSMENT:
      return {
        ...state,
        surveyAnswers: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
