import { uniqBy } from 'lodash';
import {
  SET_SURVEYS,
  SET_ASSESSMENTS,
  SET_SURVEY_BY_ID,
  SET_ANSWERED_ASSESSMENT,
} from 'actionsReducers/surveys.action';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'surveys',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['surveyList', 'allAnswers'],
};

const initState = {
  surveyList: null,
  customerAssessment: [],
  surveyById: null,
  allAnswers: [],
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
        allAnswers: uniqBy([...state.allAnswers, action.payload], 'id'),
        surveyAnswers: action.payload,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
