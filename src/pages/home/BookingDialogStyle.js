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
  bookingContent: {
    maxWidth: 1440,
    margin: '24px auto',
  },

  diagRoot: {
    padding: '0px !important',
  },
  // bookingStepsWrapper: {
  //   display: 'flex',
  //   margin: '32px auto',
  //   justifyContent: 'center',
  //   width: 900,
  // },
  // stepper: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: 650,
  //   height: 90,
  //   borderRadius: 7,
  // },
  // step: {
  //   '&>span>span:first-child>svg': { fontSize: 36 },
  //   '&>span>span:last-child>span': { fontSize: 18 },
  // },
});

export default style;
