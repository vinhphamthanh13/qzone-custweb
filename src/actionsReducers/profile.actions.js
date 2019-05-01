import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  updateProfile,
  firebaseStoreUser,
} from 'actionsApi/profile';
import { getUserDetail } from 'authentication/actions/login';
import { get } from 'lodash';

export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';
export const FIRE_BASE_STORE_USER = 'PROFILE.FIRE_BASE_STORE_USER';

export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});
export const storeFireBaseUser = payload => ({
  type: FIRE_BASE_STORE_USER,
  payload,
});

export const postUpdatedProfile = data => async (dispatch) => {
  dispatch(setLoading(true));
  const userSub = get(data, 'userSub');
  const [profileUpdated, error] = await handleRequest(updateProfile, [data]);
  if (error) {
    dispatch(setError(error));
    dispatch(updateProfileAction('error'));
  } else {
    dispatch(updateProfileAction('success'));
    dispatch(getUserDetail(userSub));
    console.log('profileUpdated', profileUpdated);
  }
  dispatch(setLoading(false));
};
export const storeFireBaseUserAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [firebaseUserStored, error] = await handleRequest(firebaseStoreUser, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(storeFireBaseUser(firebaseUserStored || 'success'));
  }
  dispatch(setLoading(false));
};
