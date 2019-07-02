import { SET_SURVEYS } from 'actionsReducers/surveys.action';

const initState = {
  surveyList: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_SURVEYS:
      return {
        ...state,
        surveyList: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
