import {
  REGISTER_WAIT_LISTS,
  SET_WAIT_LISTS,
  CANCEL_WAIT_LISTS,
  SET_WAIT_LISTS_BY_ID,
  RESET_REGISTER_WAIT_LISTS_STATUS,
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
    case REGISTER_WAIT_LISTS:
      return {
        ...state,
        waitListRegistered: action.payload,
      };
    case RESET_REGISTER_WAIT_LISTS_STATUS:
      return {
        ...state,
        waitListRegistered: null,
      };
    case SET_WAIT_LISTS:
      return {
        ...state,
        waitLists: action.payload,
      };
    case CANCEL_WAIT_LISTS:
      return {
        ...state,
        cancelWaitLists: action.payload,
        waitLists: state.waitLists.filter(waitList => waitList.waitListId),
      };
    case SET_WAIT_LISTS_BY_ID:
      return {
        ...state,
        waitListsById: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
