import { saveGuestInfo } from 'authentication/actions/login';
import { bookEventApi } from 'actionsReducers/booking.actions';

export const bookingProps = {
  mapStateToProps: ({ auth, provider, booking }) => ({
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
    selectedBookingDetail: provider.selectedBookingDetail,
    bookedEventDetail: booking.bookedEventDetail,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSaveGuestInfo: (data, cb) => dispatch(saveGuestInfo(data, cb)),
    dispatchBookEvent: (data, headers) => dispatch(bookEventApi(data, headers)),
  }),
};
