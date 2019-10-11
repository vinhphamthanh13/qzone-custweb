import { setWaitListsApi, setCancelWaitListsApi } from 'actionsReducers/waitlist.actions';
import { bookEventApi } from 'actionsReducers/booking.actions';
import { findEventByCustomerIdApi } from 'actionsReducers/common.actions';
import { cancelEventById } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsApi } from 'actionsReducers/customer.actions';
import { setAssessmentAction, setSurveysApi } from 'actionsReducers/surveys.action';

export const waitListsProps = {
  mapStateToProps: ({ waitLists, booking, landing }) => ({
    waitLists: waitLists.waitLists,
    cancelWaitLists: waitLists.cancelWaitLists,
    bookedEventDetail: booking.bookedEventDetail,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetWaitLists: (uid, headers) => dispatch(setWaitListsApi(uid, headers)),
    dispatchCanCelWaitLists: (wid, headers) => dispatch(setCancelWaitListsApi(wid, headers)),
    dispatchBookEvent: (data, headers) => dispatch(bookEventApi(data, headers)),
  })
};

export const contentProps = {
  mapStateToProps: ({ common, profile, waitLists, surveys, landing }) => ({
    eventList: common.eventList,
    profilePage: profile.profilePage,
    cancelEventByIdStatus: profile.cancelEventByIdStatus,
    updateProfileStatus: profile.updateProfileStatus,
    waitLists: waitLists.waitLists,
    surveyList: surveys.surveyList,
    customerAssessment: surveys.customerAssessment,
    rescheduleStatus: common.rescheduleStatus,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchFindEventByCustomerId: (id, headers) => dispatch(findEventByCustomerIdApi(id, headers)),
    dispatchCancelEventById: data => dispatch(cancelEventById(data)),
    dispatchTrackingAppointmentById: (data, headers) => dispatch(trackingAppointmentByIdsApi(data, headers)),
    dispatchSetSurveys: headers => dispatch(setSurveysApi(headers)),
    dispatchSetAssessments: data => dispatch(setAssessmentAction(data))
  })
};
