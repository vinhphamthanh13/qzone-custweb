import { setLoading } from 'actions/common';
import { handleRequest } from 'utils/apiHelpers';
import { fetchAvailabilityBySpecialId } from 'api/home/bookingDialog/selectProvider';

export const SET_SLOTS_BY_SPECIAL_ID = 'HOME.SET_SLOTS_BY_SPECIAL_ID';

const setSlotsBySpecialId = payload => ({
  type: SET_SLOTS_BY_SPECIAL_ID,
  payload,
});

export const fetchAvailabilityBySpecialIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [response] = await handleRequest(fetchAvailabilityBySpecialId, [data], [null]);
  if (response) {
    dispatch(setSlotsBySpecialId({ [data.specialEventId]: response }));
  } else {
    console.log('error during fetch slots by special id');
  }
  dispatch(setLoading(false));
};
