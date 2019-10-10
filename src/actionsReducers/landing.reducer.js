import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { SET_LANDING_PAGE_FACTORS } from './landing.action';

const persistConfig = {
  key: 'landing',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [],
};

const initState = {
  landingPageFactors: {},
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LANDING_PAGE_FACTORS: {
      const landingPageFactors = Object.is(action.payload, null) ?
        {} : { ...state.landingPageFactors, ...action.payload };
      return {
        ...state,
        landingPageFactors,
      };
    }
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
