import {
  SET_SURVEYS,
  SET_ASSESSMENTS,
} from 'actionsReducers/surveys.action';

const initState = {
  surveyList: null,
  customerAssessment: [],
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
    default:
      return state;
  }
};

export default reducer;
