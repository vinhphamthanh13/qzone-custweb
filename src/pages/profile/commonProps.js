import { setWaitListsApi, setCancelWaitListsApi } from 'actionsReducers/waitlist.actions';

export const waitListsProps = {
  mapStateToProps: ({ waitLists }) => ({
    waitLists: waitLists.waitLists,
    cancelWaitLists: waitLists.cancelWaitLists,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetWaitLists: (uid, headers) => dispatch(setWaitListsApi(uid, headers)),
    dispatchCanCelWaitLists: (wid, headers) => dispatch(setCancelWaitListsApi(wid, headers)),
  })
};
