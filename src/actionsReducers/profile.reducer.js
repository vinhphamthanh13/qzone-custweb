import { SET_LOADING } from 'actionsReducers/common.actions';
import { UPDATE_PROFILE } from './profile.actions';

const initState = {
  updateProfileStatus: '',
  isLoading: false,
};

const profilePage = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    default:
      return state;
  }
};

export default profilePage;
