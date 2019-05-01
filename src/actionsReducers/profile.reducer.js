import { UPDATE_PROFILE } from './profile.actions';

const initState = {
  updateProfileStatus: '',
  isLoading: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
