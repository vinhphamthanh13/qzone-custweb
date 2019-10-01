import { saveGuestInfo } from 'authentication/actions/login';
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
} from 'actionsReducers/common.actions';
import { providersByServiceIdApi, bookEventApi } from 'actionsReducers/booking.actions';
import {
  temporaryServicesByServiceIdApi,
  availabilitiesByTemporaryServiceIdApi,
  instantAvailabilitiesByTemporaryServiceIdApi,
  rescheduledAvailabilitiesByTemporaryServiceIdApi,
  selectBookingDetail,
  usersByIdApi,
} from 'actionsReducers/provider.actions';
import { setLandingPageAction } from 'actionsReducers/landing.action';
import { setOrganizationsApi } from 'actionsReducers/organization.actions';

export const homeProps = {
  mapStateToProps: ({ home, common, auth, organization }) => ({
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    organizations: organization.organizations,
    ...home,
    ...auth,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServices: () => dispatch(setServices()),
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
    dispatchOrganizations: () => dispatch(setOrganizationsApi()),
  })
};

export const landingProps = {
  mapStateToProps: ({ home, landing, common, booking }) => ({
    providersByServiceId: booking.providersByServiceId,
    categories: home.categories,
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
  }),
};

export const bookingProps = {
  mapStateToProps: ({ auth, provider, booking, landing }) => ({
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
    selectedBookingDetail: provider.selectedBookingDetail,
    bookedEventDetail: booking.bookedEventDetail,
    landingPageFactors: landing.landingPageFactors,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSaveGuestInfo: (data, cb) => dispatch(saveGuestInfo(data, cb)),
    dispatchBookEvent: (data, headers) => dispatch(bookEventApi(data, headers)),
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
