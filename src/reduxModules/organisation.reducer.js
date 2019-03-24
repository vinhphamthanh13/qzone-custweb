import { SET_LOADING } from 'actions/common';
import { SET_ORG } from './organisation.action';

const initState = {
  isLoading: false,
  orgs: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ORG:
      return {
        ...state,
        orgs: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
