import { fade } from '@material-ui/core/styles/colorManipulator';
import { makoColor, mainColor, mainLinear } from 'components/material-dashboard-pro-react';

const styles = theme => ({
  mainLinear,
  root: {
    width: '100%',
    zIndex: 30,
  },
  grow: {
    flexGrow: 1,
  },
  avatar: {
    display: 'none',
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      background: 'transparent',
      width: theme.spacing.unit * 22,
      borderRadius: 0,
    },
  },
  img: {
    width: 'auto',
    height: '100%',
  },
  search: {
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: makoColor,
    '&:hover': {
      color: fade(mainColor, 0.9),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    background: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 7,
    position: 'relative',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    width: '100%',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px 0px`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  desktopView: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  mobileView: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

export default styles;
