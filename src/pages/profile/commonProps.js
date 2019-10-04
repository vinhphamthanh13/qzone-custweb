import { setWaitListsApi, setCancelWaitListsApi } from 'actionsReducers/waitlist.actions';
import { bookEventApi } from 'actionsReducers/booking.actions';

export const waitListsProps = {
  mapStateToProps: ({ waitLists, booking }) => ({
    waitLists: waitLists.waitLists,
    cancelWaitLists: waitLists.cancelWaitLists,
    bookedEventDetail: booking.bookedEventDetail,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetWaitLists: (uid, headers) => dispatch(setWaitListsApi(uid, headers)),
    dispatchCanCelWaitLists: (wid, headers) => dispatch(setCancelWaitListsApi(wid, headers)),
    dispatchBookEvent: (data, headers) => dispatch(bookEventApi(data, headers)),
  })
};
