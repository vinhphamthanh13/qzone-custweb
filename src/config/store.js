import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';

// import { AUTHENTICATED_KEY } from 'utils/constants';
import auth from 'authentication/actions/reducer';
import common from 'actionsReducers/common.reducer';
import home from 'actionsReducers/home.reducer';
import booking from 'actionsReducers/booking.reducer';
import provider from 'actionsReducers/provider.reducer';
import profile from 'actionsReducers/profile.reducer';
import waitLists from 'actionsReducers/waitlist.reducer';
import organization from 'actionsReducers/organization.reducer';
import customer from 'actionsReducers/customer.reducer';
import surveys from 'actionsReducers/surveys.reducer';
//
// import { loadSessionToState } from 'authentication/actions/session';
// import { getUserDetail } from 'authentication/actions/login';
// import { loadSession } from './localStorage';

const rootPersistConfig = {
  key: 'qz_custweb',
  storage,
  stateReconciler: autoMergeLevel1,
  blacklist: ['common'],
};

// const persistedSession = loadSession();
const rootReducer = combineReducers({
  auth,
  common,
  home,
  booking,
  organization,
  provider,
  waitLists,
  profile,
  customer,
  surveys,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(thunk, logger),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);

const persistor = persistStore(store);
//
// // loading session from local storage to redux store
// if (persistedSession && persistedSession[AUTHENTICATED_KEY]) {
//   store.dispatch(getUserDetail(persistedSession.id));
//   store.dispatch(loadSessionToState(persistedSession));
// }

export default { store, persistor };
