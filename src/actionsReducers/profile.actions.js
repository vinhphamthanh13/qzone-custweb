import {
  setLoading,
  setError,
  setSucceed,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  updateProfile,
  eventsCancelById,
} from 'actionsApi/profile';
import { getUserDetail } from 'authentication/actions/login';
import { get } from 'lodash';

export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';
// export const FIRE_BASE_STORE_USER = 'PROFILE.FIRE_BASE_STORE_USER';
export const PROFILE_PAGE = 'PROFILE.PROFILE_PAGE';
export const CANCEL_EVENT_BY_ID = 'PROFILE.CANCEL_EVENT_BY_ID';
export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});

export const postUpdatedProfile = data => async (dispatch) => {
  dispatch(setLoading(true));
  const userSub = get(data, 'userSub') || get(data, 'id');
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
export const goProfilePage = payload => ({
  type: PROFILE_PAGE,
  payload,
});
export const cancelEventById = payload => ({
  type: CANCEL_EVENT_BY_ID,
  payload,
});

export const cancelEventByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [canceledResult, error] = await handleRequest(eventsCancelById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(cancelEventById(200 || canceledResult));
    dispatch(setSucceed('Your event is cancelled now!'));
  }
  dispatch(setLoading(false));
};
