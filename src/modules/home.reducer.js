import { SET_SERVICE_CATEGORIES, SET_SERVICES } from './home.actions';

const initialState = {
  serviceCategories: [],
  services: [],
};

const home = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_CATEGORIES:
      return { ...state, serviceCategories: action.payload };
    case SET_SERVICES:
      return { ...state, services: action.payload };
    default:
      return state;
  }
};

export default home;
