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
export const PROFILE_PAGE = 'PROFILE.PROFILE_PAGE';
export const CANCEL_EVENT_BY_ID = 'PROFILE.CANCEL_EVENT_BY_ID';
export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});

export const postUpdatedProfile = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const userSub = get(data, 'userSub') || get(data, 'id');
  const [profileUpdated, error] = await handleRequest(updateProfile, [data, headers]);
  if (error) {
    dispatch(setError(error));
    dispatch(updateProfileAction('error'));
  } else {
    dispatch(updateProfileAction(profileUpdated || 'success'));
    dispatch(getUserDetail(userSub));
  }
  dispatch(setLoading(false));
};
export const goProfilePage = payload => ({
  type: PROFILE_PAGE,
  payload,
});
export const cancelEventById = payload => ({
  type: CANCEL_EVENT_BY_ID,
  payload,
});
