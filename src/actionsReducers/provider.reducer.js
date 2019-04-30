import {
  SET_PROVIDER_DETAIL,
  SET_PROVIDER_SERVICE,
  SET_SERVICE_PROVIDER,
} from 'actionsReducers/provider.actions';

const initState = {
  providerDetail: null,
  providerServices: null,
  serviceProviders: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROVIDER_SERVICE:
      return {
        ...state,
        providerServices: action.payload,
      };
    case SET_PROVIDER_DETAIL:
      return {
        ...state,
        providerDetail: {
          ...state.providerDetail,
          ...action.payload,
        },
      };
    case SET_SERVICE_PROVIDER:
      return {
        ...state,
        serviceProviders: action.payload,
      };
    default:
      return { ...state };
  }
};

export default reducer;
