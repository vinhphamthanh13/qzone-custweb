import {
  REGISTER_WAIT_LIST,
  SET_WAIT_LIST,
  CANCEL_WAIT_LIST,
  VALIDATE_WAIT_LIST,
  SET_WAIT_LIST_BY_ID,
} from 'actionsReducers/waitlist.actions';

const initState = {
  waitListRegistered: null,
  waitLists: null,
  cancelWaitLists: null,
  waitListsValidation: null,
  waitListsById: null,
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
    case VALIDATE_WAIT_LIST:
      return {
        ...state,
        waitListsValidation: action.payload,
      };
    case SET_WAIT_LIST_BY_ID:
      return {
        ...state,
        waitListsById: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
