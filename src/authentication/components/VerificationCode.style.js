import { mainColor } from 'components/material-dashboard-pro-react';

const style = theme => ({
  logo: {
    margin: `auto ${theme.spacing.unit * 2}px auto 0px`,
  },
  avatarRoot: {
    width: theme.spacing.unit * 7.5,
    height: theme.spacing.unit * 7.5,
  },
  verification: {
    maxWidth: theme.spacing.unit * 47,
    minWidth: theme.spacing.unit * 45,
    display: 'flex',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
  header: {
    marginTop: theme.spacing.unit,
  },
  content: {
    borderLeft: `4px solid ${mainColor}`,
    paddingLeft: theme.spacing.unit * 2,
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit,
  },
  countDown: {
    width: theme.spacing.unit * 7,
    textAlign: 'right',
  },
});

export default style;
