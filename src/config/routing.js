import Home from 'pages/Home';
import Booking from 'pages/Booking';
import PageNotFound from 'pages/PageNotFound';
import AccessDenied from 'pages/AccessDenied';
import Provider from 'pages/Provider';
import Organization from 'pages/Organization';
import Profile from 'pages/Profile';
import Maintenance from 'pages/Maintenance';

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
    name: 'Normal Booking',
    component: Booking,
  },
  {
    exact: true,
    strict: true,
    path: '/booking/instant/:id',
    name: 'Instant Booking',
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
    path: '/profile/:id',
    name: 'Profile',
    component: Profile,
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
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
  },
  {
    exact: true,
    strict: true,
    name: '404',
    component: PageNotFound,
  },
];

export default rootRoutes;