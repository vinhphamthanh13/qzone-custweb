import { infoColor } from 'components/material-dashboard-pro-react';

const style = theme => ({

  passwordHint: {
    color: infoColor,
    minWidth: 'unset',
  },
  passwordHintConventions: {
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
});

export default style;
