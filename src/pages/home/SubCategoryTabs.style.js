import {
  textCenter,
  mainColor,
  grayColor,
} from 'components/material-dashboard-pro-react';

const styles = () => ({
  textCenter,
  activeItem: {
    color: mainColor,
    background: 'rgba(0, 0, 0, 0.3)',
  },
  item: {
    color: grayColor,
  },
  textCapitalized: {
    textTransform: 'capitalize',
  },
});

export default styles;
