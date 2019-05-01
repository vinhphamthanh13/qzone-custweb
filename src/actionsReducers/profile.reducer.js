import {
  UPDATE_PROFILE,
  FIRE_BASE_STORE_USER,
} from './profile.actions';

const initState = {
  updateProfileStatus: '',
  firebaseUserStored: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    case FIRE_BASE_STORE_USER:
      return {
        ...state,
        firebaseUserStored: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
