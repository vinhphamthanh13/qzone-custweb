import { REGISTER_WAIT_LIST, SET_WAIT_LIST } from 'actionsReducers/waitlist.actions';

const initState = {
  waitListRegistered: null,
  waitLists: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case REGISTER_WAIT_LIST:
      console.log('registered WaitList ', action.payload);
      return {
        ...state,
        isSuccess: true,
        successMessage: 'You have been registered in our Waitlists successfully',
        waitListRegistered: action.payload,
      };
    case SET_WAIT_LIST:
      return {
        ...state,
        waitLists: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
