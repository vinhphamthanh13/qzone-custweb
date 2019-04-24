import Home from 'pages/Home';
import Booking from 'pages/Booking';
import PageNotFound from 'pages/PageNotFound';
import AccessDenied from 'pages/AccessDenied';
import Provider from 'pages/Provider';
import Organization from 'pages/Organization';

const rootRoutes = [
  {
    exact: true,
    strict: true,
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/appointments',
    name: 'Home',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/booking/:id',
    name: 'Booking Flow',
    component: Booking,
  },
  {
    exact: true,
    strict: true,
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied,
  },
  {
    exact: true,
    strict: true,
    path: '/profile',
    name: 'Profile',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/provider/:id',
    name: 'Provider',
    component: Provider,
  },
  {
    exact: true,
    strict: true,
    path: '/organization/:id',
    name: 'Organization',
    component: Organization,
  },
  {
    exact: true,
    strict: true,
    name: '404',
    component: PageNotFound,
  },
];

export default rootRoutes;
