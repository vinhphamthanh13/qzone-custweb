import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
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

const rootPersistConfig = {
  key: 'qz_custweb',
  storage,
  stateReconciler: autoMergeLevel1,
  blacklist: [
    'common',
    'home',
    'booking',
    'organization',
    'provider',
    'waitLists',
    'profile',
    'customer',
    'surveys',
  ],
};

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

const appReducer = (state, action) => {
  let newState = state;
  if (action.type === 'RESET_APP') {
    newState = undefined;
  }
  return rootReducer(newState, action);
};

const persistedReducer = persistReducer(rootPersistConfig, appReducer);

let middleWare = [];
if (process.env.NODE_ENV === 'production') {
  middleWare = [
    ...middleWare,
    thunk,
  ];
} else {
  middleWare = [
    ...middleWare,
    thunk,
    logger,
  ];
}

const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(...middleWare),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);
const persistor = persistStore(store);

export default { store, persistor };
