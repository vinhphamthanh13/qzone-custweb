import { saveGuestInfo } from 'authentication/actions/login';

export const bookingProps = {
  mapStateToProps: ({ auth, provider }) => ({
    userDetail: auth.userDetail,
    selectedBookingDetail: provider.selectedBookingDetail,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSaveGuestInfo: (data, cb) => dispatch(saveGuestInfo(data, cb)),
  }),
};
