import {
  SET_LOADING,
  SET_ERROR,
} from 'actionsReducers/common.actions';

const initState = {
  isLoading: false,
  isError: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        isError: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
