import { REGISTER_WAIT_LIST, SET_WAIT_LIST } from 'actionsReducers/waitlist.actions';

const initState = {
  registerWaitListStatus: null,
  waitlists: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case REGISTER_WAIT_LIST:
      return {
        ...state,
        registerWaitListStatus: action.payload,
      };
    case SET_WAIT_LIST:
      return {
        ...state,
        waitlists: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
