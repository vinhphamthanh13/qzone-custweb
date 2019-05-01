import {
  SET_PROVIDER_DETAIL,
  SET_PROVIDER_SERVICE,
} from 'actionsReducers/provider.actions';

const initState = {
  providerDetail: null,
  providerServices: null,
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
    default:
      return { ...state };
  }
};

export default reducer;
