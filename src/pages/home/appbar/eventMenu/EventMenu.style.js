import { lightGrayColor, mainLinearRight, malibuColor } from 'components/material-dashboard-pro-react';

const style = () => ({
  mainLinearRight,
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    '&:hover': {
      ...mainLinearRight,
    },
  },
  title: {
    '&:hover': {
      fontWeight: 'bold',
      color: malibuColor,
    },
  },
  content: {
    '&:hover': {
      color: lightGrayColor,
    },
  },
});

export default style;
