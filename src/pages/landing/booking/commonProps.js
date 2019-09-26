
export const bookingProps = {
  mapStateToProps: ({ auth, provider }) => ({
    userDetail: auth.userDetail,
    selectedBookingDetail: provider.selectedBookingDetail,
  })
};
