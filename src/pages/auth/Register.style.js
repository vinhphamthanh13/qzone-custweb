import {
  container,
  textCenter,
} from 'components/material-dashboard-pro-react';
import customCheckboxRadioSwitch from 'components/material-dashboard-pro-react/customCheckboxRadioSwitch';
import { dangerColor, mainColor, successColor } from '../../components/material-dashboard-pro-react';

const registerPageStyle = theme => ({
  ...customCheckboxRadioSwitch,
  textCenter,
  content: {
    position: 'fixed',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: theme.zIndex.tooltip,
  },
  register: {
    display: 'flex',
    justifyContent: 'center',
  },
  registerCard: {
    maxWidth: `${theme.spacing.unit * 50}px`,
  },
  marginDense: {
    margin: 0,
  },
  container: {
    ...container,
    position: 'relative',
    zIndex: '3',
    minHeight: 'calc(100vh - 80px)',
    paddingTop: '5%',
  },
  center: {
    textAlign: 'center',
  },
  checkboxLabelControl: {
    margin: '0',
  },
  checkboxLabel: {
    marginLeft: '6px',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  inputAdornment: {
    marginRight: '18px',
    position: 'relative',
  },
  inputAdornmentIconDefault: {
    color: `${mainColor} !important`,
  },
  inputAdornmentIconSuccess: {
    color: successColor,
  },
  inputAdornmentIconError: {
    color: dangerColor,
  },
  agreement: {
    margin: `${theme.spacing.unit * 3}px 0`,
  },
  simpleButton: {
    color: mainColor,
    '&:hover': {
      background: 'transparent',
    },
  },
});

export const styles = theme => ({
  register: {
    maxWidth: theme.spacing.unit * 30,
    minWidth: theme.spacing.unit * 20,
  },
});

export default registerPageStyle;
