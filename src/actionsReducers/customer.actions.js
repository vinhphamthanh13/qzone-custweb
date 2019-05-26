import { get } from 'lodash';
import { handleResponseBulk } from 'utils/apiHelpers';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { trackingAllAppointmentByEventId } from 'actionsApi/customer';

export const TRACKING_APPOINTMENT = 'HOME.TRACKING_APPOINTMENT';

const trackingAppointmentByIds = payload => ({
  type: TRACKING_APPOINTMENT,
  payload,
});

export const trackingAppointmentByIdsAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [trackingResult, error] = await trackingAllAppointmentByEventId(data);
  if (error) {
    dispatch(setError(get(JSON.parse(error), 'response.data.message')));
  } else {
    console.log('tracking result', trackingResult);
    dispatch(trackingAppointmentByIds(handleResponseBulk(trackingResult)));
  }
  dispatch(setLoading(false));
};
