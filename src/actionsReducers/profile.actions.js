export const UPDATE_PROFILE = 'PROFILE.UPDATE_PROFILE';
export const PROFILE_PAGE = 'PROFILE.PROFILE_PAGE';
export const CANCEL_EVENT_BY_ID = 'PROFILE.CANCEL_EVENT_BY_ID';
export const updateProfileAction = payload => ({
  type: UPDATE_PROFILE,
  payload,
});
export const goProfilePage = payload => ({
  type: PROFILE_PAGE,
  payload,
});
export const cancelEventById = payload => ({
  type: CANCEL_EVENT_BY_ID,
  payload,
});
