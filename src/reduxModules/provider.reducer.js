import { SET_LOADING } from 'actionsReducers/common.actions';
import { FETCH_PROVIDER_DETAIL, FETCH_PROVIDER_SERVICE } from 'reduxModules/provider.actions';

const initState = {
  providerDetail: {},
  providerServices: [],
  isLoading: false,
};

const providerPage = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case FETCH_PROVIDER_SERVICE:
      return {
        ...state,
        providerServices: action.payload,
      };
    case FETCH_PROVIDER_DETAIL:
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

export default providerPage;
