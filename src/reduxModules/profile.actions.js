import { setLoading } from 'actions/common';
import { handleRequest } from 'utils/apiHelpers';
import { updateProfile } from 'api/profile';

export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';

export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});

export const postUpdatedProfile = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [response] = await handleRequest(updateProfile, [data], null);
  if (response) {
    dispatch(updateProfileAction(response));
  } else {
    console.log(response);
  }
  dispatch(setLoading(false));
};
