import {
  textCenter,
  mainColor,
  grayColor,
} from 'components/material-dashboard-pro-react';

const styles = () => ({
  textCenter,
  activeItem: {
    color: mainColor,
    background: 'rgba(63, 81, 181, 0.3)',
  },
  item: {
    color: grayColor,
  },
  textCapitalized: {
    textTransform: 'capitalize',
  },
  mainColor: {
    color: mainColor,
  },
  hoverTransparent: {
    '&:hover': {
      background: 'transparent',
    },
  },
  unsetPointer: {
    cursor: 'unset',
  },
});

export default styles;
