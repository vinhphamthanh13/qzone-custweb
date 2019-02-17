import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import home from 'modules/home.reducer';
import auth from 'auth/actions/reducer';
import selectProvider from 'modules/home/bookingDialog/selectProvider.reducer';

const rootReducer = combineReducers({
  auth,
  home,
  homeModules: combineReducers({
    bookingDialog: combineReducers({
      selectProvider,
    }),
  }),
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);

export default store;
