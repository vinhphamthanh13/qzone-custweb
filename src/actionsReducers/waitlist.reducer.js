import {
  REGISTER_WAIT_LIST,
  SET_WAIT_LIST,
  CANCEL_WAIT_LIST,
} from 'actionsReducers/waitlist.actions';

const initState = {
  waitListRegistered: null,
  waitLists: null,
  cancelWaitLists: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case REGISTER_WAIT_LIST:
      return {
        ...state,
        waitListRegistered: action.payload,
      };
    case SET_WAIT_LIST:
      return {
        ...state,
        waitLists: action.payload,
      };
    case CANCEL_WAIT_LIST:
      return {
        ...state,
        cancelWaitLists: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
