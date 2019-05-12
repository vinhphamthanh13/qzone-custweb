import {
  SET_LOADING,
  SET_ERROR,
  RESET_MODAL_STATUS,
  FIND_EVENT_BY_CUSTOMER_ID,
  SET_SERVICE_PROVIDERS,
} from 'actionsReducers/common.actions';

const initState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: '',
  successMessage: '',
  eventList: null,
  serviceProviders: null,
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
    case RESET_MODAL_STATUS:
      return {
        ...state,
        isError: false,
        errorMessage: '',
        isSuccess: false,
        successMessage: '',
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
    default:
      return state;
  }
};

export default reducer;
