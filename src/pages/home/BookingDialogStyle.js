import { mainLinear } from 'components/material-dashboard-pro-react';

const style = theme => ({
  mainLinear,
  root: {
    width: '100%',
  },
  avatar: {
    maxWidth: theme.spacing.unit * 4,
    maxHeight: theme.spacing.unit * 4,
    background: theme.palette.primary.light,
    margin: theme.spacing.unit * 2,
  },
  diagRoot: {
    padding: '0px !important',
  },
  bookingStepsWrapper: {
    display: 'flex',
    margin: '16px auto 32px',
    width: '70%',
  },
  bookingStepper: {
    flexGrow: 1,
    margin: '0 32px',
  },
});

export default style;
