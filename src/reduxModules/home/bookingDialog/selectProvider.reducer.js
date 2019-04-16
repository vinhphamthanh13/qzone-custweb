import {
  SET_PROVIDERS,
  SET_PROVIDER_TIMES_DETAIL,
  SET_SPECIAL_EVENT_BY_ID,
} from './selectProvider.actions';

const initialState = {
  providers: [],
  specialEvents: [],
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
    case SET_PROVIDER_TIMES_DETAIL:
      return {
        ...state,
        providerDetails: {
          ...state.providerDetails,
          ...action.payload,
        },
      };
    case SET_SPECIAL_EVENT_BY_ID:
      return {
        ...state,
        specialEvents: action.payload,
      };
    default:
      return state;
  }
};

export default selectProvider;
