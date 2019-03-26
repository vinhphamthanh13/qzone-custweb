import { SET_LOADING } from 'reduxModules/home.actions';
import { FETCH_PROVIDER_DETAIL } from 'reduxModules/provider.actions';

const initState = {
  providerDetail: [],
};

const providerPage = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case FETCH_PROVIDER_DETAIL:
      return {
        ...state,
        providerDetail: action.payload,
      };
    default:
      return { ...state };
  }
};

export default providerPage;
