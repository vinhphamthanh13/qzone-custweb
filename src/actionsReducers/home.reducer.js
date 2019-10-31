import { SET_SERVICE_PROVIDER_NEAR_BY } from './home.actions';

const initState = {
  serviceProviderNearByList: null,
};

const reducer = (state = initState, action) => {
  if (action.type === SET_SERVICE_PROVIDER_NEAR_BY) {
    return {
      ...state,
      serviceProviderNearByList: action.payload,
    };
  }
  return state;
};

export default reducer;
