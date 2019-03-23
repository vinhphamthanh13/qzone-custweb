import {
  SET_SERVICE_CATEGORIES, SET_SERVICES, SET_LOADING, SET_ORGS, SET_ALL_SERVICES,
  GET_CUSTOMER_EVENT_LIST, SEARCH_PROVIDER_BY_DISTANCE, SET_SERVICE_PROVIDERS,
} from './home.actions';

const initialState = {
  isLoading: false,
  serviceCategories: [],
  services: [],
  orgs: [],
  allServices: [],
  customerEventList: [],
  providerListByDistance: [],
  providerList: [],
};

const home = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_CATEGORIES:
      return { ...state, serviceCategories: action.payload };
    case SET_SERVICES:
      return {
        ...state,
        services: state.services.concat(
          action.payload.filter(service => state.services.every(existedService => existedService.id !== service.id)),
        ),
      };
    case SET_ALL_SERVICES:
      return {
        ...state,
        allServices: action.payload,
      };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ORGS:
      return { ...state, orgs: action.payload };
    case SET_SERVICE_PROVIDERS:
      return {
        ...state,
        providerList: action.payload,
      };
    case GET_CUSTOMER_EVENT_LIST:
      return {
        ...state,
        customerEventList: action.payload,
      };
    case SEARCH_PROVIDER_BY_DISTANCE:
      return {
        ...state,
        providerListByDistance: action.payload,
      };
    default:
      return state;
  }
};

export default home;
