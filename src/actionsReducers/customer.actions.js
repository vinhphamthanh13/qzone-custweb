import get from 'lodash/get';
import { handleResponseBulk } from 'utils/apiHelpers';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { trackingAllAppointmentByEventId } from 'actionsApi/customer';

export const TRACKING_APPOINTMENT = 'HOME.TRACKING_APPOINTMENT';
const trackingAppointmentByIds = payload => ({
  type: TRACKING_APPOINTMENT,
  payload,
});
export const trackingAppointmentByIdsApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [trackingResult, error] = await trackingAllAppointmentByEventId(data, headers);
  if (error) {
    dispatch(setError(get(JSON.parse(error), 'response.data.message')));
  } else {
    dispatch(trackingAppointmentByIds(handleResponseBulk(trackingResult)));
  }
  dispatch(setLoading(false));
};
