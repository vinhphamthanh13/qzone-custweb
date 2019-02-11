import { mainColor } from '../material-dashboard-pro-react';

const style = theme => ({
  logo: {
    margin: `auto ${theme.spacing.unit * 2}px auto 0px`,
  },
  avatarRoot: {
    width: `${theme.spacing.unit * 7.5}px`,
    height: `${theme.spacing.unit * 7.5}px`,
  },
  // Error
  errorRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorPaperRoot: {
    maxWidth: `${theme.spacing.unit * 5}%`,
    minWidth: `${theme.spacing.unit * 30}px`,
    display: 'flex',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
  errorMessage: {
    borderLeft: `3px solid ${mainColor}`,
    paddingLeft: `${theme.spacing.unit * 2}px`,
  },
  // Loading
  cover: {
    position: 'fixed',
    top: 0,
    background: 'rgba(0,0,0, 0.7)',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100000,
  },
});

export default style;
