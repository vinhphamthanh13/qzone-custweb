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
} from 'actionsReducers/common.actions';
import { providersByServiceIdApi, bookEventApi } from 'actionsReducers/booking.actions';
import {
  temporaryServicesByServiceIdApi,
  availabilitiesByTemporaryServiceIdApi,
  selectBookingDetail,
} from 'actionsReducers/provider.actions';
import { setLandingPageAction } from 'actionsReducers/landing.action';

export const homeProps = {
  mapStateToProps: ({ home, common, auth }) => ({
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    ...home,
    ...auth,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServices: () => dispatch(setServices()),
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
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
  mapStateToProps: ({ booking, common, provider }) => ({
    providersByServiceId: booking.providersByServiceId,
    bookedEventIdList: booking.bookedEventIdList,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    temporaryServiceByServiceIds: provider.temporaryServiceByServiceIds,
    availabilitiesByTemporaryServiceId: provider.availabilitiesByTemporaryServiceId,
    tabOrder: common.tabOrder,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchTemporaryServicesByServiceId: list => dispatch(temporaryServicesByServiceIdApi(list)),
    dispatchAvailabilities: (list, sId, pId, locId) =>
      dispatch(availabilitiesByTemporaryServiceIdApi(list, sId, pId, locId)),
    dispatchSelectBookingDetail: slot => dispatch(selectBookingDetail(slot)),
  }),
};

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

export const viewEventProps = {
  mapStateToProps: ({ common, auth }) => ({
    eventById: common.eventById,
    cancelEventStatus: common.cancelEventStatus,
    userDetail: auth.userDetail,
    loginSession: auth.loginSession,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchSetEventById: id => dispatch(setEventByIdApi(id)),
    dispatchCancelEvent: (id, headers) => dispatch(cancelEventByIdApi(id, headers)),
    dispatchClearCancelStatus: () => dispatch(cancelEventByIdAction(500)),
  }),
};
