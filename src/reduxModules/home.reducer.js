import {
  SET_SERVICE_CATEGORIES, SET_SERVICES, SET_LOADING, SET_ORGS, SET_ALL_SERVICES,
} from './home.actions';

const initialState = {
  isLoading: true,
  serviceCategories: [],
  services: [],
  orgs: [],
  allServices: [],
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
    default:
      return state;
  }
};

export default home;