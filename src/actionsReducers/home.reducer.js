import {
  SET_SERVICE_CATEGORIES,
  SET_SERVICES,
  SET_SERVICE_PROVIDERS,
  SET_SERVICE_PROVIDER_NEAR_BY,
  SET_SERVICES_BY_NAME,
} from './home.actions';

const initState = {
  categories: null,
  services: null,
  serviceProviders: null,
  serviceProviderNearByList: null,
  eventList: null,
  servicesByNameList: null,
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
    case SET_SERVICE_PROVIDER_NEAR_BY:
      return {
        ...state,
        serviceProviderNearByList: action.payload,
      };
    case SET_SERVICES_BY_NAME:
      return {
        ...state,
        servicesByNameList: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
