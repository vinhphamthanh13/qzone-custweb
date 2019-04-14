import { setLoading } from 'actions/common';
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
  console.log('response i sr', response);
  if (response) {
    dispatch(updateProfileAction('success'));
    dispatch(getUserDetail(userSub));
  } else {
    console.log(response);
  }
  dispatch(setLoading(false));
};
