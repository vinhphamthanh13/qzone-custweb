import {
  SET_ORGANIZATION,
  SET_SERVICE_PROVIDERS,
} from './organization.actions';

const initState = {
  serviceProviders: null,
  organization: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
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
