import {
  SET_SERVICE_CATEGORIES,
  SET_SERVICES,
  SET_SERVICE_PROVIDERS,
} from './home.actions';

const initState = {
  categories: null,
  services: null,
  serviceProviders: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_SERVICE_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case SET_SERVICES:
      return {
        ...state,
        services: action.payload,
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
