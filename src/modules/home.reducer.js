import { SET_SERVICE_CATEGORIES, SET_SERVICES, SET_LOADING } from './home.actions';

const initialState = {
  isLoading: false,
  serviceCategories: [],
  services: [],
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
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default home;
