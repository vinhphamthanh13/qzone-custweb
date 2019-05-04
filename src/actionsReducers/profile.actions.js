import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  updateProfile,
} from 'actionsApi/profile';
import { getUserDetail } from 'authentication/actions/login';
import { get } from 'lodash';

export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';
export const FIRE_BASE_STORE_USER = 'PROFILE.FIRE_BASE_STORE_USER';


export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
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
    dispatch(updateProfileAction(profileUpdated || 'success'));
    dispatch(getUserDetail(userSub));
  }
  dispatch(setLoading(false));
};
