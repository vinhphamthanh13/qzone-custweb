import { saveGuestInfo, clearGuestErrorAction, getCustomerByIdApi } from 'authentication/actions/login';
import {
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
  servicesByServiceCategoryIdBulkAction,
} from 'actionsReducers/common.actions';
import { bookEventApi, confirmWaitListsApi } from 'actionsReducers/booking.actions';
import {
  waitListTemporaryServicesByServiceIdApi,
  availabilitiesByTemporaryServiceIdBulkApi,
  instantAvailabilitiesByTemporaryServiceIdApi,
  availabilitiesByTemporaryServiceIdApi,
  selectBookingDetail,
  usersByIdApi,
  queryProviderApi,
  clearQueriedProviderAction,
  clearSelectedBookingDetail,
  tempServiceDateProviderByServiceIdApi,
  setServiceDateProviders,
  clearTempServiceDateProviderByServiceIdAction,
  setProvidersByServiceIdApi,
  clearProvidersByServiceId,
  setBookNowAction,
  clearBookNowAction,
  queryAvailabilitiesByDateApi,
} from 'actionsReducers/provider.actions';
import { setLandingPageAction } from 'actionsReducers/landing.action';
import {
  setOrganizationsApi, serviceCategoriesByOrgIdApi, serviceCategoriesByOrgIdAction, setOrgNotFoundAction,
} from 'actionsReducers/organization.actions';
import { registerWaitListsApi, setWaitListsByIdApi } from 'actionsReducers/waitlist.actions';
import { goProfilePage } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsApi } from 'actionsReducers/customer.actions';

export const homeProps = {
  mapStateToProps: ({ common, organization }) => ({
    serviceCategoriesByOrgId: organization.serviceCategoriesByOrgId,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    orgNotFound: organization.orgNotFound,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServiceCategoriesByOrgId: id => dispatch(serviceCategoriesByOrgIdApi(id)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
    dispatchClearOrgNotFound: () => dispatch(setOrgNotFoundAction(false)),
    dispatchClearTempServiceDateProviderByServiceId: () => dispatch(clearTempServiceDateProviderByServiceIdAction({})),
    dispatchClearProvidersByServiceId: () => dispatch(clearProvidersByServiceId()),
    dispatchClearBookNowList: () => dispatch(clearBookNowAction()),
  })
};

export const landingProps = {
  mapStateToProps: ({ landing, common, booking }) => ({
    providersByServiceId: booking.providersByServiceId,
    landingPageFactors: landing.landingPageFactors,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    tabOrder: common.tabOrder,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServicesByServiceCategoryId: (list, catName) => dispatch(servicesByServiceCategoryIdBulkApi(list, catName)),
    dispatchSetTabOrder: order => dispatch(setTabOrder(order)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
  })
};

export const serviceProps = {
  mapStateToProps: ({ booking, landing, provider }) => ({
    providersByServiceId: booking.providersByServiceId,
    landingPageFactors: landing.landingPageFactors,
    tempServiceDateProvider: provider.tempServiceDateProvider,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
    dispatchTempServiceDateProvider: sId => dispatch(tempServiceDateProviderByServiceIdApi(sId)),
    dispatchSetServiceDateProviders: data => dispatch(setServiceDateProviders(data)),
    dispatchSetProvidersByServiceId: sId => dispatch(setProvidersByServiceIdApi(sId)),
  }),
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
    landingPageFactors: landing.landingPageFactors,
    queriedProvider: provider.queriedProvider,
    serviceDateProviders: provider.serviceDateProviders,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSelectBookingDetail: slot => dispatch(selectBookingDetail(slot)),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
    dispatchQueryProvider: data => dispatch(queryProviderApi(data)),
    dispatchClearQueriedProvider: () => dispatch(clearQueriedProviderAction()),
  }),
};

export const providerProps = {
  mapStateToProps: ({ provider }) => ({
    providersByServiceId: provider.providersByServiceId,
    availabilitiesByTemporaryServiceId: provider.availabilitiesByTemporaryServiceId,
    bookNowList: provider.bookNowList,
    queryAvailabilitiesByTemporaryServiceId: provider.queryAvailabilitiesByTemporaryServiceId,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchAvailabilities: (list, sId, pId, locId) =>
      dispatch(availabilitiesByTemporaryServiceIdBulkApi(list, sId, pId, locId)),
    dispatchSetBookNowList: data => dispatch(setBookNowAction(data)),
    dispatchQueryAvailabilitiesByDate: (data, key) => dispatch(queryAvailabilitiesByDateApi(data, key)),
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
    dispatchClearSelectedBookingDetail: () => dispatch(clearSelectedBookingDetail()),
  }),
};

export const viewEventProps = {
  mapStateToProps: ({ common, auth, provider, landing }) => ({
    eventById: common.eventById,
    cancelEventStatus: common.cancelEventStatus,
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
    rescheduledAvailabilitiesByTemporaryServiceId: provider.rescheduledAvailabilitiesByTemporaryServiceId,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetEventById: id => dispatch(setEventByIdApi(id)),
    dispatchCancelEvent: (id, headers) => dispatch(cancelEventByIdApi(id, headers)),
    dispatchClearCancelStatus: () => dispatch(cancelEventByIdAction(500)),
    dispatchRescheduledAvailabilities: (tId, sId, pId, locId) =>
      dispatch(availabilitiesByTemporaryServiceIdApi(tId, sId, pId, locId)),
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
  mapStateToProps: ({ common, provider, landing }) => ({
    instantAvailabilitiesByTemporaryServiceId: provider.instantAvailabilitiesByTemporaryServiceId,
    temporaryServicesById: common.temporaryServicesById,
    providerById: provider.providerById,
    landingPageFactors: landing.landingPageFactors,
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
  mapStateToProps: ({ waitLists, auth, landing, provider }) => ({
    waitListsById: waitLists.waitListsById,
    userDetailById: auth.userDetailById,
    landingPageFactors: landing.landingPageFactors,
    selectedBookingDetail: provider.selectedBookingDetail,
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

export const clientFormProps = {
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
  mapDispatchToProps: dispatch => ({
    dispatchOrganizations: () => dispatch(setOrganizationsApi()),
    dispatchSetLandingPage: data => dispatch(setLandingPageAction(data)),
    dispatchClearServicesByServiceCategoryId: () => dispatch(servicesByServiceCategoryIdBulkAction(null)),
    dispatchClearServiceCategoriesByOrgId: () => dispatch(serviceCategoriesByOrgIdAction([])),
    dispatchClearTempServiceDateProviderByServiceId: () => dispatch(clearTempServiceDateProviderByServiceIdAction({})),
  }),
};

export const pageNotFoundProps = {
  mapStateToProps: ({ landing }) => ({
    landingPageFactors: landing.landingPageFactors,
  }),
};
