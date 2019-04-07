import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import home from 'reduxModules/home.reducer';
import appointments from 'reduxModules/appointments.reducer';
import auth from 'authentication/actions/reducer';
import { loadSessionToState } from 'authentication/actions/session';
import selectProvider from 'reduxModules/home/bookingDialog/selectProvider.reducer';
import bookingDialog from 'reduxModules/home/bookingDialog.reducer';
import organization from 'reduxModules/organization.reducer';
import serviceCard from 'reduxModules/serviceCard.reducer';
import providerPage from 'reduxModules/provider.reducer';
import { getUserDetail } from 'authentication/actions/login';
import { loadSession } from './localStorage';

const persistedSession = loadSession();
const rootReducer = combineReducers({
  auth,
  home,
  appointments,
  homeModules: combineReducers({
    bookingDialog,
    bookingDialogModules: combineReducers({
      selectProvider,
    }),
  }),
  organization,
  serviceCard,
  providerPage,
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
