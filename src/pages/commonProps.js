import { setServiceCategories, setServices } from 'actionsReducers/home.actions';
import {
  setTemporaryServices,
  servicesByServiceCategoryIdBulkApi,
} from 'actionsReducers/common.actions';
import { providersByServiceIdApi } from 'actionsReducers/booking.actions';
import { temporaryServicesByServiceIdApi } from 'actionsReducers/provider.actions';

export const homeProps = {
  mapStateToProps: ({ home, common, auth }) => ({
    ...home,
    ...common,
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
    ...home,
    ...common,
    ...booking,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchServiceCategory: () => dispatch(setServiceCategories()),
    dispatchServicesByServiceCategoryId: (list, catName) => dispatch(servicesByServiceCategoryIdBulkApi(list, catName)),
    dispatchProvidersByServiceId: (sId, sName, catName) => dispatch(providersByServiceIdApi(sId, sName, catName)),
    dispatchServices: () => dispatch(setServices()),
    dispatchTemporaryServices: () => dispatch(setTemporaryServices()),
  })
};

export const providersProps = {
  mapStateToProps: ({ booking, common, provider }) => ({
    providersByServiceId: booking.providersByServiceId,
    servicesByServiceCategoryId: common.servicesByServiceCategoryId,
    temporaryServiceByServiceIds: provider.temporaryServiceByServiceIds,
  }),
  mapDispatchToProps: dispatch => ({
    dispatchTemporaryServicesByServiceId: list => dispatch(temporaryServicesByServiceIdApi(list)),
  }),
};
