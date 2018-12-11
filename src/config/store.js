import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import home from 'modules/home.reducer';
import selectService from 'modules/home/bookingDialog/selectService.reducer';

const rootReducer = combineReducers({
  home,
  homeModules: combineReducers({
    bookingDialog: combineReducers({
      selectService,
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
