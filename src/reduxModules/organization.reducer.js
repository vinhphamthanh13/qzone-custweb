import { SET_LOADING } from 'actions/common';
import { SET_ORGANIZATION } from './organization.actions';

const initState = {
  isLoading: false,
  organization: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
