import { setLoading } from 'actionsReducers/common';
import { handleRequest } from 'utils/apiHelpers';
import { updateProfile } from 'api/profile';
import { getUserDetail } from 'authentication/actions/login';
import { get } from 'lodash';

export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';

export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});

export const postUpdatedProfile = data => async (dispatch) => {
  dispatch(setLoading(true));
  const userSub = get(data, 'userSub');
  const [response] = await handleRequest(updateProfile, [data], null);
  if (response) {
    dispatch(updateProfileAction('success'));
    dispatch(getUserDetail(userSub));
  } else {
    dispatch(updateProfileAction('error'));
    console.log(response);
  }
  dispatch(setLoading(false));
};
