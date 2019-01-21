import {
  SET_LOADING,
  SET_PROVIDERS,
  SET_PROVIDER_TIME_DETAIL,
} from './selectProvider.actions';

const initialState = {
  isLoading: false,
  providers: [],
  providerDetails: {},
};

const selectProvider = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROVIDERS:
      return {
        ...state,
        providers: action.payload.length === 0 ? [] : state.providers.concat(
          action.payload.filter(
            provider => state.providers.every(existedProvider => existedProvider.id !== provider.id),
          ),
        ),
      };
    case SET_PROVIDER_TIME_DETAIL:
      return {
        ...state,
        providerDetails: {
          [action.payload.providerId]: action.payload.providerTimeDetail,
        },
      };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default selectProvider;
