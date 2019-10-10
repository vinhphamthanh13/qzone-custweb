import { saveGuestInfo, clearGuestErrorAction, getCustomerByIdApi } from 'authentication/actions/login';
import { setServiceCategories, setServices } from 'actionsReducers/home.actions';
import {
  setTemporaryServices,
  servicesByServiceCategoryIdBulkApi,
  setTabOrder,
  setChunkFactorAction,
  setEventByIdApi,
  cancelEventByIdApi,
  cancelEventByIdAction,
  temporaryServicesByIdApi,
  rescheduleEventApi,
  rescheduleStatusAction,
  findEventByCustomerIdApi,
} from 'actionsReducers/common.actions';
import { providersByServiceIdApi, bookEventApi, confirmWaitListsApi } from 'actionsReducers/booking.actions';
import {
  temporaryServicesByServiceIdApi,
  waitListTemporaryServicesByServiceIdApi,
  availabilitiesByTemporaryServiceIdApi,
  instantAvailabilitiesByTemporaryServiceIdApi,
  rescheduledAvailabilitiesByTemporaryServiceIdApi,
  selectBookingDetail,
  usersByIdApi,
} from 'actionsReducers/provider.actions';
import { setLandingPageAction } from 'actionsReducers/landing.action';
import { setOrganizationsApi, serviceCategoriesByOrgIdApi } from 'actionsReducers/organization.actions';
import { registerWaitListsApi, setWaitListsByIdApi } from 'actionsReducers/waitlist.actions';
import { goProfilePage } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsApi } from 'actionsReducers/customer.actions';

export const homeProps = {
  mapStateToProps: ({ common, organization }) => ({
    serviceCategoriesByOrgId: organization.serviceCategoriesByOrgId,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServices: () => dispatch(setServices()),
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
    dispatchServiceCategoriesByOrgId: id => dispatch(serviceCategoriesByOrgIdApi(id)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  })
};

export const landingProps = {
  mapStateToProps: ({ landing, common, booking }) => ({
    providersByServiceId: booking.providersByServiceId,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    tabOrder: common.tabOrder,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchServicesByServiceCategoryId: (list, catName) => dispatch(servicesByServiceCategoryIdBulkApi(list, catName)),
    dispatchProvidersByServiceId: (sId, sName, catName) => dispatch(providersByServiceIdApi(sId, sName, catName)),
    dispatchServices: () => dispatch(setServices()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
    dispatchTemporaryServicesByServiceId: list => dispatch(temporaryServicesByServiceIdApi(list)),
    dispatchSetTabOrder: order => dispatch(setTabOrder(order)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  })
};

export const tabProps = {
  mapStateToProps: ({ common, landing }) => ({
    landingPageFactors: landing.landingPageFactors,
    responsiveLayout: common.responsiveLayout,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchChunkFactor: width => dispatch(setChunkFactorAction(width)),
  })
};

export const providersProps = {
  mapStateToProps: ({ booking, common, provider, landing }) => ({
    providersByServiceId: booking.providersByServiceId,
    bookedEventIdList: booking.bookedEventIdList,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    temporaryServiceByServiceIds: provider.temporaryServiceByServiceIds,
    availabilitiesByTemporaryServiceId: provider.availabilitiesByTemporaryServiceId,
    tabOrder: common.tabOrder,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchTemporaryServicesByServiceId: list => dispatch(temporaryServicesByServiceIdApi(list)),
    dispatchAvailabilities: (list, sId, pId, locId) =>
      dispatch(availabilitiesByTemporaryServiceIdApi(list, sId, pId, locId)),
    dispatchSelectBookingDetail: slot => dispatch(selectBookingDetail(slot)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  }),
};

export const bookingProps = {
  mapStateToProps: ({ auth, provider, booking, landing }) => ({
    userDetail: auth.userDetail,
    userDetailById: auth.userDetailById,
    loginSession: auth.loginSession,
    selectedBookingDetail: provider.selectedBookingDetail,
    bookedEventDetail: booking.bookedEventDetail,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchBookEvent: (data, headers) => dispatch(bookEventApi(data, headers)),
    dispatchConfirmWaitLists: data => dispatch(confirmWaitListsApi(data)),
  }),
};

export const viewEventProps = {
  mapStateToProps: ({ common, auth, provider }) => ({
    eventById: common.eventById,
    cancelEventStatus: common.cancelEventStatus,
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
    rescheduledAvailabilitiesByTemporaryServiceId: provider.rescheduledAvailabilitiesByTemporaryServiceId,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetEventById: id => dispatch(setEventByIdApi(id)),
    dispatchCancelEvent: (id, headers) => dispatch(cancelEventByIdApi(id, headers)),
    dispatchClearCancelStatus: () => dispatch(cancelEventByIdAction(500)),
    dispatchRescheduledAvailabilities: (tId, sId, pId, locId) =>
      dispatch(rescheduledAvailabilitiesByTemporaryServiceIdApi(tId, sId, pId, locId)),
  }),
};

export const rescheduleProps = {
  mapStateToProps: ({ common }) => ({
    rescheduleStatus: common.rescheduleStatus,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchRescheduleEvent: (data, headers) => dispatch(rescheduleEventApi(data, headers)),
    dispatchRescheduleStatus: code => dispatch(rescheduleStatusAction(code)),
    dispatchSetEventById: id => dispatch(setEventByIdApi(id)),
  }),
};

export const instantProps = {
  mapStateToProps: ({ common, provider }) => ({
    instantAvailabilitiesByTemporaryServiceId: provider.instantAvailabilitiesByTemporaryServiceId,
    temporaryServicesById: common.temporaryServicesById,
    providerById: provider.providerById,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchInstantAvailabilitiesByTemporaryServiceId: id => dispatch(
      instantAvailabilitiesByTemporaryServiceIdApi(id),
    ),
    dispatchSelectBookingDetail: slot => dispatch(selectBookingDetail(slot)),
    dispatchTemporaryServicesById: slot => dispatch(temporaryServicesByIdApi(slot)),
    dispatchUsersById: id => dispatch(usersByIdApi(id)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  }),
};

export const waitListProps = {
  mapStateToProps: ({ provider, auth }) => ({
    waitListTemporaryServicesByServiceId: provider.waitListTemporaryServicesByServiceId,
    loginSession: auth.loginSession,
    userDetail: auth.userDetail,

  }),
  mapDispatchToProps: dispatch => ({
    dispatchWaitListTemporaryServicesByServiceId: id => dispatch(
      waitListTemporaryServicesByServiceIdApi(id),
    ),
    dispatchRegisterWaitLists: (data, headers) => dispatch(registerWaitListsApi(data, headers)),
  }),
};

export const redirectToInstantProps = {
  mapStateToProps: ({ waitLists, auth }) => ({
    waitListsById: waitLists.waitListsById,
    userDetailById: auth.userDetailById,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchWaitListsById: (id, headers) => dispatch(setWaitListsByIdApi(id, headers)),
    dispatchSelectBookingDetail: slot => dispatch(selectBookingDetail(slot)),
    dispatchGetCustomerById: id => dispatch(getCustomerByIdApi(id)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  }),
};

export const appBarProps = {
  mapStateToProps: ({ common, auth, customer, booking }) => ({
    eventList: common.eventList,
    loginSession: auth.loginSession,
    trackingAppointmentById: customer.trackingAppointmentById,
    bookedEventId: booking.bookedEventId,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchEventsByCustomerId: (id, headers) => dispatch(findEventByCustomerIdApi(id, headers)),
    dispatchGoToProfile: page => dispatch(goProfilePage(page)),
    dispatchTrackingEvent: (list, headers) => dispatch(trackingAppointmentByIdsApi(list, headers)),
  }),
};

export const clientInfoProps = {
  mapStateToProps: ({ auth }) => ({
    guestUserError: auth.guestUserError,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSaveGuestInfo: (data, cb) => dispatch(saveGuestInfo(data, cb)),
    dispatchClearGuestError: () => dispatch(clearGuestErrorAction()),
  }),
};

export const redirectOrgProps = {
  mapStateToProps: ({ organization }) => ({
    organizations: organization.organizations,
  }),
  mapDispatchTOProps: dispatch => ({
    dispatchOrganizations: () => dispatch(setOrganizationsApi()),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  }),
};
