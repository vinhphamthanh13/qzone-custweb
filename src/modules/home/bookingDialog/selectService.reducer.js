import { SET_LOADING, SET_SERVICES } from './selectService.actions';

const initialState = {
  isLoading: false,
  services: [],
};

const selectService = (state = initialState, action) => {
  switch (action.type) {
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

export default selectService;
