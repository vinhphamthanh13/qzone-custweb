import Home from 'pages/Home';
import Providers from 'pages/landing/provider/Providers';
import Booking from 'pages/landing/booking/Booking';
import InstantBooking from 'pages/landing/booking/Instant';
import RedirectToInstant from 'pages/landing/waitlist/RedirectToInstant';
import PageNotFound from 'pages/PageNotFound';
import AccessDenied from 'pages/AccessDenied';
import Provider from 'pages/Provider';
import Organization from 'pages/Organization';
import Profile from 'pages/Profile';
import Maintenance from 'pages/Maintenance';
import ViewEvent from 'pages/landing/viewEvent/ViewEvent';
import Assessment from 'pages/Assessment';
import RedirectOrg from 'pages/RedirectOrg';

const rootRoutes = [
  {
    exact: true,
    strict: true,
    path: '/:orgId',
    name: 'Custweb for Booking Service',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/',
    name: 'Select Organization',
    component: RedirectOrg,
  },
  {
    exact: true,
    strict: true,
    path: '/provider-by-service/:sId',
    name: 'Provider By Service',
    component: Providers,
  },
  {
    exact: true,
    strict: true,
    path: '/confirm-booking',
    name: 'Confirm Booking',
    component: Booking,
  },
  {
    exact: true,
    strict: true,
    path: '/survey/:surveyId/:customerId',
    name: 'Take survey',
    component: Assessment,
  },
  {
    exact: true,
    strict: true,
    path: '/booking/instant/:id',
    name: 'Instant Booking',
    component: InstantBooking,
  },
  {
    exact: true,
    strict: true,
    path: '/booking/waitlist/:id',
    name: 'Enroll WaitLists',
    component: RedirectToInstant,
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
    path: '/in-maintenance/:id',
    name: 'Maintenance',
    component: Maintenance,
  },
  {
    exact: true,
    strict: true,
    path: '/event/:id',
    name: 'View Appointment',
    component: ViewEvent,
  },
  {
    exact: true,
    strict: true,
    name: '404',
    component: PageNotFound,
  },
];

export default rootRoutes;
