import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

import auth from 'authentication/actions/reducer';
import common from 'actionsReducers/common.reducer';
import home from 'actionsReducers/home.reducer';
import booking from 'actionsReducers/booking.reducer';
import provider from 'actionsReducers/provider.reducer';
import profile from 'actionsReducers/profile.reducer';
import waitLists from 'actionsReducers/waitlist.reducer';

import appointments from 'reduxModules/appointments.reducer';
import { loadSessionToState } from 'authentication/actions/session';
import organization from 'reduxModules/organization.reducer';
import { getUserDetail } from 'authentication/actions/login';
import { loadSession } from './localStorage';

const persistedSession = loadSession();
const rootReducer = combineReducers({
  auth,
  common,
  home,
  booking,
  organization,
  provider,
  waitLists,

  appointments,
  profile,
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);

// loading session from local storage to redux store
if (persistedSession && (persistedSession.isAuthenticated || persistedSession.qz_token)) {
  store.dispatch(getUserDetail(persistedSession.id));
  store.dispatch(loadSessionToState(persistedSession));
}

export default store;
