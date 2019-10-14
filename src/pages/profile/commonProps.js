import { setWaitListsApi, setCancelWaitListsApi } from 'actionsReducers/waitlist.actions';
import { bookEventApi } from 'actionsReducers/booking.actions';
import { findEventByCustomerIdApi } from 'actionsReducers/common.actions';
import { cancelEventById } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsApi } from 'actionsReducers/customer.actions';
import { setAssessmentAction, setSurveysApi } from 'actionsReducers/surveys.action';
import { updateAwsUserApi, updateSocialUsersApi } from 'authentication/actions/login';
import { logoutApi } from 'authentication/actions/logout';

export const waitListsProps = {
  mapStateToProps: ({ waitLists, booking, landing }) => ({
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

export const profileProps = {
  mapStateToProps: ({ auth, profile, landing }) => ({
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
    updateProfileStatus: profile.updateProfileStatus,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchFindEventByCustomerId: (id, headers) => dispatch(findEventByCustomerIdApi(id, headers)),
    dispatchSetWaitLists: (uid, headers) => dispatch(setWaitListsApi(uid, headers)),
    dispatchLogout: authentication => dispatch(logoutApi(authentication)),
  }),
};

export const contentProps = {
  mapStateToProps: ({ common, profile, waitLists, surveys, landing, auth }) => ({
    eventList: common.eventList,
    profilePage: profile.profilePage,
    cancelEventByIdStatus: profile.cancelEventByIdStatus,
    waitLists: waitLists.waitLists,
    surveyList: surveys.surveyList,
    customerAssessment: surveys.customerAssessment,
    rescheduleStatus: common.rescheduleStatus,
    landingPageFactors: landing.landingPageFactors,
    userDetail: auth.userDetail,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchCancelEventById: data => dispatch(cancelEventById(data)),
    dispatchTrackingAppointmentById: (data, headers) => dispatch(trackingAppointmentByIdsApi(data, headers)),
    dispatchSetSurveys: headers => dispatch(setSurveysApi(headers)),
    dispatchSetAssessments: data => dispatch(setAssessmentAction(data)),
  })
};

export const infoProps = {
  mapStateToProps: ({ auth }) => ({
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchUpdateAwsUser: (data, headers) => dispatch(updateAwsUserApi(data, headers)),
    dispatchUpdateSciUser: (data, headers) => dispatch(updateSocialUsersApi(data, headers)),
  }),
};
