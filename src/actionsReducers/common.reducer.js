import {
  SET_LOADING,
  SET_ERROR,
  SET_SUCCEED,
  RESET_MODAL_STATUS,
  FIND_EVENT_BY_CUSTOMER_ID,
  SET_SERVICE_PROVIDERS,
  SET_TEMPORARY_SERVICE_BY_LOCATION,
  SET_EVENT_BY_ID,
} from 'actionsReducers/common.actions';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'common',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    'isLoading',
    'isError',
    'isSucceed',
    'errorMessage',
    'succeedMessage',
    'eventList',
    'eventById',
  ],
};

const initState = {
  isLoading: false,
  isError: false,
  isSucceed: false,
  errorMessage: '',
  succeedMessage: '',
  eventList: null,
  serviceProviders: null,
  temporaryServicesByLocation: null,
  eventById: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case SET_SUCCEED:
      return {
        ...state,
        isSucceed: true,
        succeedMessage: action.payload,
      };
    case RESET_MODAL_STATUS:
      return {
        ...state,
        isError: false,
        errorMessage: '',
        isSucceed: false,
        succeedMessage: '',
      };
    case FIND_EVENT_BY_CUSTOMER_ID:
      return {
        ...state,
        eventList: action.payload,
      };
    case SET_SERVICE_PROVIDERS:
      return {
        ...state,
        serviceProviders: action.payload,
      };
    case SET_TEMPORARY_SERVICE_BY_LOCATION:
      return {
        ...state,
        temporaryServicesByLocation: action.payload,
      };
    case SET_EVENT_BY_ID:
      return {
        ...state,
        eventById: action.payload,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
