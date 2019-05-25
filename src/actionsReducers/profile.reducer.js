import { PROFILE } from 'utils/constants';
import {
  UPDATE_PROFILE,
  PROFILE_PAGE,
} from './profile.actions';

const initState = {
  updateProfileStatus: '',
  firebaseUserStored: null,
  profilePage: PROFILE.PAGE.WAIT_LIST,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    case PROFILE_PAGE:
      return {
        ...state,
        profilePage: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
