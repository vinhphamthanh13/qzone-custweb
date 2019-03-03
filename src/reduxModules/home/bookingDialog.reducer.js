import {
  SET_LOADING, SET_STATUS, RESET_STATUS,
} from './bookingDialog.actions';

const initialState = {
  isLoading: false,
  status: {
    type: '',
    message: '',
  },
};

const bookingDialog = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    case RESET_STATUS:
      return { ...state, status: initialState.status };
    default:
      return state;
  }
};

export default bookingDialog;
