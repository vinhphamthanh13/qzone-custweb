import {
  LOGIN_SUCCESS, LOGOUT,
} from './auth.actions';

const initialState = {
  userAuthorized: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, userAuthorized: action.payload };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default auth;
