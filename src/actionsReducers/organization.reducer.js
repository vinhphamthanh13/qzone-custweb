import {
  SET_LOADING,
  SET_ERROR,
  RESET_ERROR,
} from 'actionsReducers/common.actions';
import { SET_SERVICE_PROVIDERS } from './organization.actions';


const initState = {
  serviceProviders: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_SERVICE_PROVIDERS:
      return {
        ...state,
        serviceProviders: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case RESET_ERROR:
      return {
        ...state,
        isError: false,
        errorMessage: '',
      };
    default:
      return state;
  }
};

export default reducer;
