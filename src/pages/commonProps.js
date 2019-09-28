import { setServiceCategories, setServices } from 'actionsReducers/home.actions';
import {
  setTemporaryServices,
  servicesByServiceCategoryIdBulkApi,
  setTabOrder,
} from 'actionsReducers/common.actions';
import { providersByServiceIdApi } from 'actionsReducers/booking.actions';
import {
  temporaryServicesByServiceIdApi,
  availabilitiesByTemporaryServiceIdApi,
  selectBookingDetail,
} from 'actionsReducers/provider.actions';

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
  mapStateToProps: ({ home, common, booking }) => ({
    providersByServiceId: booking.providersByServiceId,
    categories: home.categories,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    tabOrder: common.tabOrder,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchServicesByServiceCategoryId: (list, catName) => dispatch(servicesByServiceCategoryIdBulkApi(list, catName)),
    dispatchProvidersByServiceId: (sId, sName, catName) => dispatch(providersByServiceIdApi(sId, sName, catName)),
    dispatchServices: () => dispatch(setServices()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
    dispatchTemporaryServicesByServiceId: list => dispatch(temporaryServicesByServiceIdApi(list)),
    dispatchSetTabOrder: order => dispatch(setTabOrder(order)),
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
