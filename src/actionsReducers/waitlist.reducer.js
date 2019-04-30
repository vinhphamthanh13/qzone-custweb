import { SET_LOADING } from 'actionsReducers/common.actions';
import { REGISTER_WAITLIST, FETCH_WAITLIST } from 'actionsReducers/waitlist.actions';

const initState = {
  isLoading: false,
  registerWaitListStatus: '',
};

const waitList = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case REGISTER_WAITLIST:
      return {
        ...state,
        waitListsStatus: action.payload,
      };
    case FETCH_WAITLIST:
      return {
        ...state,
        waitList: action.payload,
      };
    default:
      return state;
  }
};

export default waitList;
